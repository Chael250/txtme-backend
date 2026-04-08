import { Router } from 'express';
import * as contactController from '../controllers/contact.controller.js';
import * as tagController from '../controllers/tag.controller.js';
import * as noteController from '../controllers/note.controller.js';
import * as aiController from '../controllers/ai.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { contactSchema, updateContactSchema, tagSchema, noteSchema } from '../utils/validation.schemas.js';

const router = Router();

router.use(protect);

// Specialized routes (MUST be before /:id)
router.get('/search', contactController.searchContacts);
router.get('/filter', contactController.filterContacts);
router.get('/recent', contactController.getRecentContacts);
router.get('/favorites', contactController.getFavoriteContacts);
router.post('/ai-search', aiController.aiSearch);

// Standard CRUD
router.route('/')
  .get(contactController.getAllContacts)
  .post(validate(contactSchema), contactController.createContact);

router.route('/:id')
  .get(contactController.getContact)
  .put(validate(updateContactSchema), contactController.updateContact)
  .delete(contactController.deleteContact);

// Tag management for contacts
router.post('/:id/tags', validate(tagSchema), tagController.addTagToContact);
router.delete('/:id/tags/:tagId', tagController.removeTagFromContact);

// Note management for contacts
router.route('/:id/notes')
  .post(validate(noteSchema), noteController.createNote)
  .get(noteController.getNotesForContact);

export default router;
