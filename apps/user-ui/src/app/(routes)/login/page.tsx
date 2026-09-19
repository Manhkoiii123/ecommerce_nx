"use client";
import { Eye, EyeOff } from "lucide-react";
import GoogleButton from "../../../shared/components/goggle-button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

type FormData = {
  email: string;
  password: string;
};

const Page = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const loginMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/login-user`,
        data,
        { withCredentials: true },
      );
      return response.data;
    },
    onSuccess: () => {
      setServerError(null);
      router.push("/");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const errorMessage =
        error.response?.data?.message || error.message || "Invalid credentials";
      setServerError(errorMessage);
    },
  });

  const onSubmit = (data: FormData) => {
    setServerError(null);
    loginMutation.mutate(data);
  };

  return (
    <div className="w-full py-10 min-h-[85vh] bg-[#f1f1f1]">
      <h1 className="text-4xl font-poppins font-semibold text-black text-center">
        Login
      </h1>
      <p className="text-center text-lg font-medium py-3 text-[#00000099]">
        Home . Login
      </p>
      <div className="w-full flex justify-center">
        <div className="md:w-[480px] p-8 bg-white shadow rounded-lg">
          <h3 className="text-3xl font-semibold text-center mb-2">
            Login to ManhShop
          </h3>
          <p className="text-center text-gray-500 mb-4">
            Don't have an account?
            <Link href={"/signup"} className="text-blue-500">
              Sign up
            </Link>
          </p>
          <GoogleButton />
          <div className="flex items-center my-5 text-gray-400 text-sm">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-3"> or Sign in with email</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="manhtranduc0202@gmail.com"
              className="w-full p-2 border border-gray-300 outline-0 !rounded mb-1"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: "Invalid email",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">
                {String(errors.email.message)}
              </p>
            )}
            <label className="block text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={passwordVisible ? "text" : "password"}
                placeholder="******"
                className="w-full p-2 border border-gray-300 outline-0 !rounded mb-1"
                {...register("password", {
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
            {errors.password && (
              <p className="text-red-500 text-sm">
                {String(errors.password.message)}
              </p>
            )}
            <div className="flex justify-between items-center my-4">
              <label className="flex items-center text-gray-600">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                Remember me
              </label>
              <Link className="text-blue-500 text-sm" href={"/forgot-password"}>
                Forgot password?
              </Link>
            </div>
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full text-lg cursor-pointer bg-black text-white py-2 !rounded-lg"
            >
              {loginMutation.isPending ? "Logging in..." : "Login"}
            </button>
            {serverError && (
              <p className="text-red-500 text-sm mt-2">{serverError}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;
