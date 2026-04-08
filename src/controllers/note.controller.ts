import type { Response, NextFunction } from 'express';
import * as noteService from '../services/note.service.js';

export const createNote = async (req: any, res: Response, next: NextFunction) => {
  try {
    const note = await noteService.createNote(req.user.id, req.params.id, req.body.content);
    res.status(201).json({ status: 'success', data: { note } });
  } catch (error) {
    next(error);
  }
};

export const getNotesForContact = async (req: any, res: Response, next: NextFunction) => {
  try {
    const notes = await noteService.getNotesForContact(req.user.id, req.params.id);
    res.status(200).json({ status: 'success', results: notes.length, data: { notes } });
  } catch (error) {
    next(error);
  }
};

export const updateNote = async (req: any, res: Response, next: NextFunction) => {
  try {
    const note = await noteService.updateNote(req.user.id, req.params.id, req.body.content);
    res.status(200).json({ status: 'success', data: { note } });
  } catch (error) {
    next(error);
  }
};

export const deleteNote = async (req: any, res: Response, next: NextFunction) => {
  try {
    await noteService.deleteNote(req.user.id, req.params.id);
    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    next(error);
  }
};
