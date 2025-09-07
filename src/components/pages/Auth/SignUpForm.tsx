"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Eye, EyeOff, LoaderPinwheel } from "lucide-react";
import { useApi } from "@/hooks/useApi";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Common country codes
const countryCodes = [
  { code: "+1", name: "CA/US", flag: "🇺🇸🇨🇦", id: "ca-us" },
  { code: "+44", name: "UK", flag: "🇬🇧", id: "uk" },
  { code: "+49", name: "DE", flag: "🇩🇪", id: "de" },
  { code: "+33", name: "FR", flag: "🇫🇷", id: "fr" },
  { code: "+39", name: "IT", flag: "🇮🇹", id: "it" },
  { code: "+34", name: "ES", flag: "🇪🇸", id: "es" },
  { code: "+81", name: "JP", flag: "🇯🇵", id: "jp" },
  { code: "+86", name: "CN", flag: "🇨🇳", id: "cn" },
  { code: "+91", name: "IN", flag: "🇮🇳", id: "in" },
  { code: "+61", name: "AU", flag: "🇦🇺", id: "au" },
  { code: "+55", name: "BR", flag: "🇧🇷", id: "br" },
  { code: "+52", name: "MX", flag: "🇲🇽", id: "mx" },
  { code: "+7", name: "RU", flag: "🇷🇺", id: "ru" },
  { code: "+82", name: "KR", flag: "🇰🇷", id: "kr" },
  { code: "+31", name: "NL", flag: "🇳🇱", id: "nl" },
  { code: "+46", name: "SE", flag: "🇸🇪", id: "se" },
  { code: "+47", name: "NO", flag: "🇳🇴", id: "no" },
  { code: "+45", name: "DK", flag: "🇩🇰", id: "dk" },
  { code: "+41", name: "CH", flag: "🇨🇭", id: "ch" },
];

const formSchema = z
  .object({
    name: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters.",
    }),
    confirmPassword: z.string(),
    countryCode: z.string().min(1, {
      message: "Please select a country code.",
    }),
    phone: z.string().min(10, {
      message: "Please enter a valid phone number.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const { loading, error, fetchData } = useApi();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      countryCode: "+1",
      phone: "",
    },
    mode: "onChange", // Enable real-time validation
  });

  // Watch password fields
  const password = form.watch("password");
  const confirmPassword = form.watch("confirmPassword");

  // Validate passwords in real-time
  useEffect(() => {
    if (confirmPassword) {
      form.trigger("confirmPassword");
    }
  }, [password, confirmPassword, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Combine country code with phone number
      const fullPhoneNumber = values.countryCode + values.phone;
      
      const response = await fetchData("/auth/register", {
        method: "POST",
        data: {
          name: values.name,
          email: values.email,
          password: values.password,
          phone: fullPhoneNumber,
        },
      });
      
      if (response) {
        setSuccessMessage("Registration successful! Redirecting to email verification...");
        console.log("Registration successful:", response);
        
        // Redirect to verify page with email parameter
        setTimeout(() => {
          router.push(`/verify?email=${encodeURIComponent(values.email)}`);
        }, 1500);
      }
    } catch (error) {
      console.error("Registration failed:", error);
    }
  }

  return (
    <div className="w-full  space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Create an Account</h2>
        <p className="text-muted-foreground mt-2">
          Enter your details to register
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-2 grid grid-cols-1 gap-3"
        >
          {error && (
            <Alert variant="destructive" className="col-span-full">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {successMessage && (
            <Alert className="col-span-full border-green-200 bg-green-50">
              <AlertDescription className="text-green-800">
                {successMessage}
              </AlertDescription>
            </Alert>
          )}
          <div className="col-span-full">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your email"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-2">
            <FormField
              control={form.control}
              name="countryCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Code" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {countryCodes.map((country) => (
                        <SelectItem 
                          key={country.id} 
                          value={country.code}
                        >
                          <span className="flex items-center gap-2">
                            <span>{country.flag}</span>
                            <span>{country.name}</span>
                            <span className="text-muted-foreground">({country.code})</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your phone number"
                      type="tel"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="Enter your password"
                      type={showPassword ? "text" : "password"}
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="Confirm your password"
                      type={showConfirmPassword ? "text" : "password"}
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={loading} type="submit" className="w-full">
            {loading ? (
              <span>
                <LoaderPinwheel className="animate-spin" />
              </span>
            ) : (
              <span>Sign Up</span>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
