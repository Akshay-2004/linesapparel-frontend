"use client";

import React, { useState, useEffect, useRef } from "react";
import { useApi } from "@/hooks/useApi";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mail, ArrowLeft, RefreshCw } from "lucide-react";

interface VerifyOTPFormProps {
  email?: string;
  onVerificationSuccess?: () => void;
}

const VerifyOTPForm: React.FC<VerifyOTPFormProps> = ({ 
  email: initialEmail, 
  onVerificationSuccess 
}) => {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [email, setEmail] = useState(initialEmail || "");
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const { data, error, loading, fetchData } = useApi();
  const router = useRouter();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Handle OTP input change
  const handleOTPChange = (index: number, value: string) => {
    if (value.length > 1) return; // Prevent multiple characters
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.slice(0, 6).split("");
    
    if (pasteArray.every(char => /^\d$/.test(char))) {
      setOtp(pasteArray.concat(new Array(6 - pasteArray.length).fill("")));
      // Focus last filled input or next empty one
      const nextIndex = Math.min(pasteArray.length, 5);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  // Verify OTP
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      return;
    }

    const otpString = otp.join("");
    if (otpString.length !== 6) {
      return;
    }

    try {
      await fetchData("/auth/verify-otp", {
        method: "POST",
        data: {
          email: email.trim(),
          otp: otpString
        }
      });

      setShowSuccess(true);
      
      // Call success callback or redirect after a short delay
      setTimeout(() => {
        if (onVerificationSuccess) {
          onVerificationSuccess();
        } else {
          router.push("/");
        }
      }, 2000);
    } catch (err) {
      console.error("OTP verification failed:", err);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    if (!email.trim() || isResending || resendTimer > 0) return;

    setIsResending(true);
    try {
      await fetchData("/auth/resend-otp", {
        method: "POST",
        data: {
          email: email.trim()
        }
      });

      // Start resend timer
      setResendTimer(60);
      setOtp(new Array(6).fill(""));
      inputRefs.current[0]?.focus();
    } catch (err) {
      console.error("Resend OTP failed:", err);
    } finally {
      setIsResending(false);
    }
  };

  // Resend timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Auto-focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  if (showSuccess) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Email Verified!</h3>
            <p className="text-sm text-gray-500 mb-4">
              Your email has been successfully verified. Redirecting you to the homepage...
            </p>
            <div className="flex items-center justify-center">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4">
          <Mail className="h-6 w-6 text-blue-600" />
        </div>
        <CardTitle>Verify Your Email</CardTitle>
        <CardDescription>
          Enter the 6-digit verification code sent to your email
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!initialEmail && (
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full"
            />
          </div>
        )}

        {initialEmail && (
          <div className="text-center text-sm text-gray-600 mb-4">
            Code sent to: <span className="font-medium">{initialEmail}</span>
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleVerifyOTP} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Verification Code
            </label>
            <div className="flex gap-2 justify-center">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOTPChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-12 h-12 text-center text-lg font-medium"
                  placeholder="0"
                />
              ))}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading || otp.join("").length !== 6 || !email.trim()}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify Email"
            )}
          </Button>
        </form>

        <div className="text-center">
          <button
            type="button"
            onClick={handleResendOTP}
            disabled={isResending || resendTimer > 0 || !email.trim()}
            className="text-sm text-blue-600 hover:text-blue-500 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-1 mx-auto"
          >
            {isResending ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                Sending...
              </>
            ) : resendTimer > 0 ? (
              `Resend code in ${resendTimer}s`
            ) : (
              <>
                <RefreshCw className="h-3 w-3" />
                Resend verification code
              </>
            )}
          </button>
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={() => router.push("/sign-up")}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center gap-1 mx-auto"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to Sign Up
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VerifyOTPForm;
