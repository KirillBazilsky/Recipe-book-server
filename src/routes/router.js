import express from 'express';
import recipesRouter from './recipesRoutes.js';
import usersRouter from './usersRoutes.js';
import authRouter from './authRoutes.js';
import favoritesRouter from './favoritesRoutes.js';

const router = express.Router();

router.use('/recipes', recipesRouter); 

router.use('/users', usersRouter);

router.use('/auth', authRouter);

router.use('/favorites', favoritesRouter);

export default router;