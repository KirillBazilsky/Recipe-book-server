import * as express from 'express';

declare module 'express-serve-static-core' {
  interface Request {
    user: { userId: string; name: string; favoritesId: string };
  }
}

export {};