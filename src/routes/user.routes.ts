import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { updateUserSchema } from '../utils/validation.schemas.js';

const router = Router();

// Protect all routes below this middleware
router.use(protect);

router.route('/')
  .get(userController.getAllUsers);

router.route('/:id')
  .get(userController.getUser)
  .put(validate(updateUserSchema), userController.updateUser)
  .delete(userController.deleteUser);

export default router;
