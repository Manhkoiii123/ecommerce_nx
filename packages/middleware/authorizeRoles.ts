import { NextFunction, Response } from "express";

export const isSeller = async (req: any, res: Response, next: NextFunction) => {
  try {
    if (req.role !== "seller") {
      return res.status(403).json({ message: "Unauthorized" });
    }
    next();
  } catch (error) {
    return next(error);
  }
};

export const isUser = async (req: any, res: Response, next: NextFunction) => {
  try {
    if (req.role !== "user") {
      return res.status(403).json({ message: "Unauthorized" });
    }
    next();
  } catch (error) {
    return next(error);
  }
};
