import { NextFunction, Request, Response } from "express";
import {
  checkOtpRestrictions,
  handleForgotPassword,
  sendOtp,
  trackOtpRequests,
  validateRegistration,
  verifyForgotPasswordOtp,
  verifyOtp,
} from "../utils/auth.helper";
import prisma from "@packages/libs/prisma";
import { ValidationError } from "@packages/error-handler";
import bcrypt from "bcryptjs";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { setCookie } from "../utils/cookies/setCookie";
import Stripe from "stripe";

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

// login user
export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new ValidationError("All fields are required"));
    }
    const user = await prisma.users.findUnique({
      where: { email },
    });
    if (!user) {
      return next(new ValidationError("User not found"));
    }
    const isMatch = await bcrypt.compare(password, user.password!);
    if (!isMatch) {
      return next(new ValidationError("Invalid credentials"));
    }
    const accessToken = jwt.sign(
      { id: user.id, role: "user" },
      process.env.ACCESS_TOKEN_SECRET!,
      {
        expiresIn: "1h",
      },
    );
    const refreshToken = jwt.sign(
      { id: user.id, role: "user" },
      process.env.REFRESH_TOKEN_SECRET!,
      {
        expiresIn: "7d",
      },
    );
    setCookie(res, "access_token", accessToken);
    setCookie(res, "refresh_token", refreshToken);
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    return next(error);
  }
};

// user forgot password
export const userForgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  await handleForgotPassword(req, res, next, "user");
};

// verify forgot password otp
export const verifyUserForgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  await verifyForgotPasswordOtp(req, res, next);
};

// user reset password
export const userResetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return next(new ValidationError("All fields are required"));
    }
    const user = await prisma.users.findUnique({
      where: { email },
    });
    if (!user) {
      return next(new ValidationError("User not found"));
    }
    // compare new password with old password
    const isMatch = await bcrypt.compare(newPassword, user.password!);
    if (isMatch) {
      return next(
        new ValidationError(
          "New password cannot be the same as the old password",
        ),
      );
    }
    // update password
    await prisma.users.update({
      where: { email },
      data: { password: await bcrypt.hash(newPassword, 10) },
    });
    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    return next(error);
  }
};

// refresh token

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) {
      return next(new ValidationError("Refresh token is required"));
    }
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!,
    ) as { id: string; role: string };
    if (!decoded || !decoded.id || !decoded.role) {
      return new JsonWebTokenError("Invalid refresh token");
    }
    let account;
    // if (decoded.role === "user") {
    account = await prisma.users.findUnique({
      where: { id: decoded.id },
    });
    // } else if (decoded.role === "admin") {
    //   account = await prisma.admins.findUnique({
    //     where: { id: decoded.id },
    //   });
    // } else {
    //   return next(new ValidationError("Invalid role"));
    // }
    if (!account) {
      return next(new JsonWebTokenError("Account not found"));
    }
    const newAccessToken = jwt.sign(
      { id: account.id, role: decoded.role },
      process.env.ACCESS_TOKEN_SECRET!,
      {
        expiresIn: "15m",
      },
    );
    setCookie(res, "access_token", newAccessToken);
    return res.status(200).json({ success: true });
  } catch (error) {
    return next(error);
  }
};

// get logged in user

export const getUser = async (req: any, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    res.status(200).json(user);
  } catch (error) {
    return next(error);
  }
};

// register seller
export const registerSeller = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    validateRegistration(req.body, "seller");
    const { email, name } = req.body;
    const existingSeller = await prisma.sellers.findUnique({
      where: { email },
    });
    if (existingSeller) {
      return next(new ValidationError("Seller already exists with this email"));
    }
    // check otp restrictions
    await checkOtpRestrictions(email, next);
    // track otp requests
    await trackOtpRequests(email, next);
    // send otp
    await sendOtp(email, name, "seller-activation-mail");

    res.status(200).json({
      success: true,
      message: "Otp sent to your email. Please check your inbox.",
    });
  } catch (error) {
    return next(error);
  }
};

// verify seller with otp
export const verifySeller = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, otp, password, name, phone_number, country } = req.body;
    if (!email || !otp || !password || !name || !phone_number || !country) {
      return next(new ValidationError("All fields are required"));
    }
    const existingSeller = await prisma.sellers.findUnique({
      where: { email },
    });
    if (existingSeller) {
      return next(new ValidationError("Seller already exists with this email"));
    }
    await verifyOtp(email, otp, next);
    const hashedPassword = await bcrypt.hash(password, 10);
    const seller = await prisma.sellers.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone_number,
        country,
      },
    });
    res.status(201).json({ seller, message: "Seller registered successfully" });
  } catch (error) {
    return next(error);
  }
};

// create a new shop
export const creatShop = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, bio, address, opening_hours, website, category, sellerId } =
      req.body;
    if (!name || !address || !opening_hours || !category || !sellerId) {
      return next(new ValidationError("All fields are required"));
    }
    const shopData: any = {
      name,
      bio,
      address,
      opening_hours,
      category,
      sellerId,
    };
    if (website && website.trim() !== "") {
      shopData.website = website;
    }
    const shop = await prisma.shops.create({
      data: shopData,
    });
    res.status(201).json({ success: true, shop });
  } catch (error) {
    return next(error);
  }
};

// create stripe connect account link

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

export const createStripeConnectAccountLink = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { sellerId } = req.body;
    if (!sellerId) {
      return next(new ValidationError("Seller ID is required"));
    }
    const seller = await prisma.sellers.findUnique({
      where: { id: sellerId },
    });
    if (!seller) {
      return next(new ValidationError("Seller not found"));
    }
    // VN (and some countries) cannot request card_payments — transfers only (cross-border payouts)
    const capabilities: Stripe.AccountCreateParams.Capabilities =
      seller.country === "VN"
        ? { transfers: { requested: true } }
        : {
            card_payments: { requested: true },
            transfers: { requested: true },
          };

    const accountParams: Stripe.AccountCreateParams = {
      type: "express",
      email: seller.email,
      country: seller.country,
      capabilities,
    };

    // Recipient agreement required for payout-only countries like VN
    if (seller.country === "VN") {
      accountParams.tos_acceptance = {
        service_agreement: "recipient",
      };
    }

    const account = await stripe.accounts.create(accountParams);
    await prisma.sellers.update({
      where: { id: sellerId },
      data: { stripeId: account.id },
    });
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `http://localhost:3000/success`,
      return_url: `http://localhost:3000/success`,
      type: "account_onboarding",
    });
    res.status(200).json({ url: accountLink.url });
  } catch (error) {
    return next(error);
  }
};

// login seller
export const loginSeller = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new ValidationError("All fields are required"));
    }
    const seller = await prisma.sellers.findUnique({
      where: { email },
    });
    if (!seller) {
      return next(new ValidationError("Seller not found"));
    }
    const isMatch = await bcrypt.compare(password, seller.password!);
    if (!isMatch) {
      return next(new ValidationError("Invalid credentials"));
    }
    const accessToken = jwt.sign(
      { id: seller.id, role: "seller" },
      process.env.ACCESS_TOKEN_SECRET!,
      {
        expiresIn: "15m",
      },
    );
    const refreshToken = jwt.sign(
      { id: seller.id, role: "seller" },
      process.env.REFRESH_TOKEN_SECRET!,
      {
        expiresIn: "7d",
      },
    );
    setCookie(res, "seller-access-token", accessToken);
    setCookie(res, "seller-refresh-token", refreshToken);
    res.status(200).json({
      message: "Login successful",
      user: {
        id: seller.id,
        email: seller.email,
        name: seller.name,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const getSeller = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  try {
    const seller = req.seller;
    res.status(200).json(seller);
  } catch (error) {
    return next(error);
  }
};
