import crypto from "crypto";
import { ValidationError } from "@packages/error-handler";
import { NextFunction } from "express";
import redis from "@packages/libs/redis";
import { sendEmail } from "./sendMail";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateRegistration = (
  data: any,
  userType: "user" | "seller",
) => {
  const { name, email, password, phone_number, country } = data;
  if (
    !name ||
    !email ||
    !password ||
    (userType === "seller" && (!phone_number || !country))
  ) {
    throw new ValidationError("All fields are required");
  }
  if (!emailRegex.test(email)) {
    throw new ValidationError("Invalid email address");
  }
};

export const checkOtpRestrictions = async (
  email: string,
  next: NextFunction,
) => {
  if (await redis.get(`otp_lock:${email}`)) {
    return next(
      new ValidationError(
        "Account locked due to too many failed attempts.Try again after 30 minutes.",
      ),
    );
  }
  if (await redis.get(`otp_spam_lock:${email}`)) {
    return next(
      new ValidationError(
        "Too many Otp requests. Please wait for 1 hour before sending another request.",
      ),
    );
  }
  if (await redis.get(`otp_cooldown:${email}`)) {
    return next(
      new ValidationError(
        "Please wait for 1 minute before sending another request.",
      ),
    );
  }
};

export const sendOtp = async (
  email: string,
  name: string,
  template: string,
) => {
  const otp = crypto.randomInt(1000, 9999).toString();
  await sendEmail(email, "Verify your email", template, { name, otp });
  await redis.set(`otp:${email}`, otp, "EX", 60 * 5);
  await redis.set(`otp_cooldown:${email}`, "true", "EX", 60);
};

export const trackOtpRequests = async (email: string, next: NextFunction) => {
  const otpRequestKey = `otp_request_count:${email}`;
  let otpRequests = parseInt((await redis.get(otpRequestKey)) || "0");
  if (otpRequests >= 2) {
    await redis.set(`otp_spam_lock:${email}`, "true", "EX", 60 * 60);
    return next(
      new ValidationError(
        "Too many Otp requests. Please wait for 1 hour before sending another request.",
      ),
    );
  }
  await redis.set(otpRequestKey, otpRequests + 1, "EX", 60);
};

export const verifyOtp = async (
  email: string,
  otp: string,
  next: NextFunction,
) => {
  const storedOtp = await redis.get(`otp:${email}`);
  if (!storedOtp) {
    return next(new ValidationError("Invalid otp"));
  }
  const failedAttemptsKey = `otp_attempts:${email}`;
  const failedAttempts = parseInt((await redis.get(failedAttemptsKey)) || "0");

  if (storedOtp !== otp) {
    if (failedAttempts >= 2) {
      await redis.set(`otp_lock:${email}`, "locked", "EX", 60 * 30); // locked for 30 minutes
      await redis.del(`otp:${email}`, failedAttemptsKey);
      return next(
        new ValidationError(
          "Account locked due to too many failed attempts.Try again after 30 minutes.",
        ),
      );
    }
    await redis.set(failedAttemptsKey, failedAttempts + 1, "EX", 60 * 5);
    return next(
      new ValidationError(`Invalid otp. ${2 - failedAttempts} attempts left.`),
    );
  }
  await redis.del(`otp:${email}`, failedAttemptsKey);
  return true;
};
