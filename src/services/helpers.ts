
import { JwtPayload } from "jsonwebtoken";
import { MongooseError } from "mongoose";

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

// export const  isMongoError = (error: unknown): error is MongooseError =>  {
//     return !!(error && typeof error === 'object' && 'code' in error && typeof error.code === 'number')
//   }

export const isUserJwtPayload = (payload: JwtPayload | string | undefined): payload is JwtPayload=> {
  return !!(payload && typeof payload === "object" && "userId" in payload && "name" in payload && "favoritesId" in payload)
}