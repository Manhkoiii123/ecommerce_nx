"use client";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import React from "react";
import StripeLogo from "../../../assets/svgs/stripe-logo";

const Page = () => {
  return (
    <div className="w-full py-10 min-h-screen bg-[#f1f1f1]">
      <h1 className="text-4xl font-poppins font-semibold text-black text-center">
        Success
      </h1>
      <p className="text-center text-lg font-medium py-3 text-[#00000099]">
        Home . Success
      </p>
      <div className="w-full flex justify-center">
        <div className="md:w-[480px] p-8 bg-white shadow rounded-lg text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
          </div>
          <div className="flex items-center justify-center gap-2 mb-3">
            <StripeLogo size={28} />
          </div>
          <h3 className="text-2xl font-semibold mb-2">
            Stripe connected successfully
          </h3>
          <p className="text-gray-500 mb-6">
            Your seller payout account is set up. You can now log in and start
            selling on ManhShop.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/login"
              className="w-full text-lg bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Go to Login
            </Link>
            <Link
              href="/"
              className="w-full text-lg border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
