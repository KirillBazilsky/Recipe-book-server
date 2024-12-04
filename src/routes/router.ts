import express from 'express';
import recipesRouter from './recipesRoutes';
import usersRouter from './usersRoutes';
import authRouter from './authRoutes';
import favoritesRouter from './favoritesRoutes';

const router = express.Router();
router.use('/recipes', recipesRouter); 

router.use('/users', usersRouter);

router.use('/auth', authRouter);

router.use('/favorites', favoritesRouter);

export default router;