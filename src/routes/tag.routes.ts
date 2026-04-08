import { Router } from 'express';
import * as tagController from '../controllers/tag.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { tagSchema } from '../utils/validation.schemas.js';

const router = Router();

router.use(protect);

router.route('/')
  .get(tagController.getAllTags)
  .post(validate(tagSchema), tagController.createTag);

router.route('/:id')
  .delete(tagController.deleteTag);

export default router;
