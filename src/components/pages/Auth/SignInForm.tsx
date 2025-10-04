"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useApi } from "@/hooks/useApi";
import { useRouter } from "next/navigation";
import { useUserDetails, type UserDetails, EUserRole } from "@/hooks/useUserDetails";

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: EUserRole;
  phone?: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}
const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
});
const SignInForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { fetchData, loading } = useApi<User>();
  const { refreshUserData, login } = useUserDetails();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetchData("/auth/login", {
        method: "POST",
        data: {
          email: values.email,
          password: values.password,
        },
      });
      
      if (response) {
        // Update global auth state immediately after successful login
        login(response);
        
        if (response?.role === EUserRole.admin || response?.role === EUserRole.superAdmin) {
          // Redirect to admin dashboard or perform admin-specific actions
          router.replace("/dashboard");
        }
        if (response?.role === EUserRole.client) {
          router.replace("/");
        }
      }
    } catch (error) {
      console.error("Error during sign-in:", error);
    }
  }
  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-6 sm:mt-10 space-y-4 sm:space-y-6"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm sm:text-base">Email address</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter your email" 
                    className="h-10 sm:h-11"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm sm:text-base">Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="h-10 sm:h-11 pr-10"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                      ) : (
                        <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-xs sm:text-sm font-semibold text-primary hover:text-primary/90"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-10 sm:h-11 bg-primary hover:bg-primary/90"
          >
            {loading ? (
              <span>
                <Loader2 className="animate-spin h-4 w-4 sm:h-5 sm:w-5" />
              </span>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SignInForm;
