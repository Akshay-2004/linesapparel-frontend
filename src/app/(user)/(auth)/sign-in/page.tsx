import React from "react";
import logo from "@/assets/logo.png";
import LoginImage from "@/assets/products/StrapiMidiDress.png";
import Image from "next/image";
import Link from "next/link";
import SignInForm from "@/components/pages/Auth/SignInForm";

export default function SignIn() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="flex flex-1 flex-col justify-center px-4 py-8 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-md lg:max-w-sm xl:w-96 p-4 sm:p-6 lg:p-8 rounded-lg shadow-xl bg-white">
          <div>
            <Image
              alt="Your Company"
              src={logo}
              width={100}
              height={100}
              className="h-8 sm:h-10 w-auto"
            />
            <h2 className="mt-6 sm:mt-8 text-xl sm:text-2xl font-bold text-gray-900">
              Sign in to your account
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Not a member?{" "}
              <Link
                href="/sign-up"
                className="font-semibold text-primary hover:text-primary/90"
              >
                register now
              </Link>
            </p>
          </div>
          <SignInForm />

          {/* Form section */}
        </div>
      </div>

      {/* Right side - Image */}
      <div className="relative container mx-auto hidden w-0 flex-1 lg:block">
        <Image
          src={LoginImage}
          alt="Login"
          className="absolute inset-0 h-full w-full object-cover"
          priority
        />
      </div>
    </div>
  );
}
