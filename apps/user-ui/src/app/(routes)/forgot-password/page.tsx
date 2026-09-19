"use client";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

type EmailFormData = {
  email: string;
};

type PasswordFormData = {
  password: string;
};

type Step = "email" | "otp" | "reset";

const Page = () => {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [canResend, setCanResend] = useState(true);
  const [timer, setTimer] = useState(60);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors },
  } = useForm<EmailFormData>();

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
  } = useForm<PasswordFormData>();

  const startResendTimer = () => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const forgotPasswordMutation = useMutation({
    mutationFn: async (data: EmailFormData) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/forgot-password-user`,
        data,
      );
      return response.data;
    },
    onSuccess: (data, formData) => {
      setEmail(formData.email);
      setStep("otp");
      setCanResend(false);
      setTimer(60);
      startResendTimer();
      toast.success(data?.message || "OTP sent to your email");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(
        error.response?.data?.message || error.message || "Something went wrong",
      );
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/verify-forgot-password-user`,
        { email, otp: otp.join("") },
      );
      return response.data;
    },
    onSuccess: (data) => {
      setStep("reset");
      toast.success(data?.message || "OTP verified successfully");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(
        error.response?.data?.message || error.message || "Invalid OTP",
      );
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async (data: PasswordFormData) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/reset-password-user`,
        { email, newPassword: data.password },
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Password reset successfully");
      router.push("/login");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to reset password",
      );
    },
  });

  const onEmailSubmit = (data: EmailFormData) => {
    forgotPasswordMutation.mutate(data);
  };

  const onPasswordSubmit = (data: PasswordFormData) => {
    resetPasswordMutation.mutate(data);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const resendOtp = () => {
    if (!email) return;
    setOtp(["", "", "", ""]);
    forgotPasswordMutation.mutate({ email });
  };

  return (
    <div className="w-full py-10 min-h-[85vh] bg-[#f1f1f1]">
      <h1 className="text-4xl font-poppins font-semibold text-black text-center">
        Forgot Password
      </h1>
      <p className="text-center text-lg font-medium py-3 text-[#00000099]">
        Home . Forgot Password
      </p>
      <div className="w-full flex justify-center">
        <div className="md:w-[480px] p-8 bg-white shadow rounded-lg">
          <h3 className="text-3xl font-semibold text-center mb-2">
            Reset your password
          </h3>
          <p className="text-center text-gray-500 mb-4">
            Go back to
            <Link href={"/login"} className="text-blue-500">
              {" "}
              Login
            </Link>
          </p>

          {step === "email" && (
            <form onSubmit={handleEmailSubmit(onEmailSubmit)}>
              <label className="block text-gray-700 mb-1">Email</label>
              <input
                type="email"
                placeholder="manhtranduc0202@gmail.com"
                className="w-full p-2 border border-gray-300 outline-0 !rounded mb-1"
                {...registerEmail("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: "Invalid email",
                  },
                })}
              />
              {emailErrors.email && (
                <p className="text-red-500 text-sm">
                  {String(emailErrors.email.message)}
                </p>
              )}
              <button
                type="submit"
                disabled={forgotPasswordMutation.isPending}
                className="w-full text-lg cursor-pointer bg-black text-white py-2 !rounded-lg mt-4"
              >
                {forgotPasswordMutation.isPending
                  ? "Sending OTP..."
                  : "Submit"}
              </button>
            </form>
          )}

          {step === "otp" && (
            <div>
              <h3 className="text-xl font-semibold text-center mb-4">
                Enter OTP
              </h3>
              <p className="text-center text-gray-500 text-sm mb-4">
                We sent a code to {email}
              </p>
              <div className="flex justify-center gap-6">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      if (el) inputRefs.current[index] = el;
                    }}
                    maxLength={1}
                    className="w-12 h-12 text-center border border-gray-300 outline-none !rounded"
                    type="text"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  />
                ))}
              </div>
              <button
                disabled={verifyOtpMutation.isPending}
                onClick={() => verifyOtpMutation.mutate()}
                className="w-full mt-4 text-lg cursor-pointer bg-black text-white py-2 !rounded-lg"
              >
                {verifyOtpMutation.isPending ? "Verifying OTP..." : "Verify OTP"}
              </button>
              <p className="text-center text-sm mt-4">
                {canResend ? (
                  <button
                    className="text-blue-500 cursor-pointer"
                    onClick={resendOtp}
                    disabled={forgotPasswordMutation.isPending}
                  >
                    Resend OTP
                  </button>
                ) : (
                  <span className="text-gray-500">Resend OTP in {timer}s</span>
                )}
              </p>
            </div>
          )}

          {step === "reset" && (
            <form onSubmit={handlePasswordSubmit(onPasswordSubmit)}>
              <label className="block text-gray-700 mb-1">New Password</label>
              <div className="relative">
                <input
                  type={passwordVisible ? "text" : "password"}
                  placeholder="******"
                  className="w-full p-2 border border-gray-300 outline-0 !rounded mb-1"
                  {...registerPassword("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400"
                >
                  {passwordVisible ? <Eye /> : <EyeOff />}
                </button>
              </div>
              {passwordErrors.password && (
                <p className="text-red-500 text-sm">
                  {String(passwordErrors.password.message)}
                </p>
              )}
              <button
                type="submit"
                disabled={resetPasswordMutation.isPending}
                className="w-full text-lg cursor-pointer bg-black text-white py-2 !rounded-lg mt-4"
              >
                {resetPasswordMutation.isPending
                  ? "Resetting..."
                  : "Reset Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
