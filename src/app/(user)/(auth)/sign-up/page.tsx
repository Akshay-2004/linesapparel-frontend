import React from "react";
import logo from "@/assets/logo.png";
import LoginImage from "@/assets/products/StrapiMidiDress.png";
import Image from "next/image";
import SignUpForm from "@/components/pages/Auth/SignUpForm";
export default function SignUp() {
  return (
    <div className="min-h-screen flex">
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:px-20 xl:px-24">
        <div className=" w-full   p-8 rounded-lg shadow-xl bg-white">
          <div>
            <Image
              alt="Your Company"
              src={logo}
              width={100}
              height={100}
              className="h-10 w-auto"
            />
          </div>
          <SignUpForm />

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
