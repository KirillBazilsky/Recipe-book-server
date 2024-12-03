import * as mongoose from 'mongoose';

declare module 'mongoose' {
  interface MongooseError {
    code?: number;
  }
}

export {};