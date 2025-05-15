import { Router } from 'express';
import authRoutes from './auth.route';
import gameRoutes from './game.route';

const router = Router();

// Mount routes with their base paths
router.use('/api/auth', authRoutes);
router.use('/api/games', gameRoutes);

export default router;