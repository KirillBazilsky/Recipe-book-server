import { Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { MongoServerError } from "mongodb";
import { userMessages } from "../config/constants";
import { ParsedQs } from "qs";

export interface IMergeDefined {
  <T>(argumentsObj: Partial<T>, existingObj: T): T;
}

export const mergeDefined: IMergeDefined = <T>(
  argumentsObj: Partial<T>,
  existingObj: T
): T => {
  return Object.fromEntries(
    Object.entries({ ...existingObj, ...argumentsObj }).filter(
      ([_, value]) => value !== undefined && value !== null
    )
  ) as T;
};

export const isUserJwtPayload = (
  payload: JwtPayload | string | undefined
): payload is JwtPayload => {
  return !!(
    payload &&
    typeof payload === "object" &&
    "userId" in payload &&
    "name" in payload &&
    "favoritesId" in payload
  );
};

export const errorHandler = (error: unknown, res: Response): Response => {
  if (error instanceof MongoServerError) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "Recipe with this name already exists" });
    }
  }

  if (error instanceof Error) {
    if (Object.values(userMessages).includes(error.message)) {
      return res.status(400).json({ message: error.message });
    }
  }

  return res.status(500).json({ message: "Unknown error occurred" });
};

export const  toString = (
  value: ParsedQs | string | string[] | ParsedQs[] | undefined
): string | undefined => (typeof value === "string" ? value : undefined);

export const validateEntity = (entity: unknown, res: Response) => {
  if (!entity) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  return
}