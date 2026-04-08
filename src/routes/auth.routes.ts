import { Router } from 'express';
import { register, login, logout, refresh, getMe } from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { protect } from '../middlewares/auth.middleware.js';
import { registerSchema, loginSchema } from '../utils/validation.schemas.js';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', logout);
router.post('/refresh-token', refresh);
router.get('/me', protect, getMe);

export default router;
