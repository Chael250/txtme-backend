import { Router } from 'express';
import * as noteController from '../controllers/note.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { noteSchema } from '../utils/validation.schemas.js';

const router = Router();

router.use(protect);

router.route('/:id')
  .put(validate(noteSchema), noteController.updateNote)
  .delete(noteController.deleteNote);

export default router;
