import { NextFunction, Request, Response } from "express";
import {
  checkOtpRestrictions,
  sendOtp,
  trackOtpRequests,
  validateRegistration,
  verifyOtp,
} from "../utils/auth.helper";
import prisma from "@packages/libs/prisma";
import { ValidationError } from "@packages/error-handler";
import bcrypt from "bcryptjs";

// user registration
export const userRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    validateRegistration(req.body, "user");
    const { email, name } = req.body;
    const existingUser = await prisma.users.findUnique({
      where: { email },
    });
    if (existingUser) {
      return next(new ValidationError("User already exists with this email"));
    }
    // check otp restrictions
    await checkOtpRestrictions(email, next);
    // track otp requests
    await trackOtpRequests(email, next);
    // send otp
    await sendOtp(email, name, "user-activation-mail");
    return res.status(200).json({
      success: true,
      message: "Otp sent to your email. Please check your inbox.",
    });
  } catch (error) {
    return next(error);
  }
};

// verify user with otp
export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, otp, password, name } = req.body;
    if (!email || !otp || !password || !name) {
      return next(new ValidationError("All fields are required"));
    }
    const existingUser = await prisma.users.findUnique({
      where: { email },
    });
    if (existingUser) {
      return next(new ValidationError("User already exists with this email"));
    }
    await verifyOtp(email, otp, next);
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.users.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });
    return res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (error) {
    return next(error);
  }
};
