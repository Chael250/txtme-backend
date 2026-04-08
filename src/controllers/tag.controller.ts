import type { Response, NextFunction } from 'express';
import * as tagService from '../services/tag.service.js';

export const createTag = async (req: any, res: Response, next: NextFunction) => {
  try {
    const tag = await tagService.createTag(req.user.id, req.body.name);
    res.status(201).json({ status: 'success', data: { tag } });
  } catch (error) {
    next(error);
  }
};

export const getAllTags = async (req: any, res: Response, next: NextFunction) => {
  try {
    const tags = await tagService.getAllTags(req.user.id);
    res.status(200).json({ status: 'success', results: tags.length, data: { tags } });
  } catch (error) {
    next(error);
  }
};

export const deleteTag = async (req: any, res: Response, next: NextFunction) => {
  try {
    await tagService.deleteTag(req.user.id, req.params.id);
    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    next(error);
  }
};

export const addTagToContact = async (req: any, res: Response, next: NextFunction) => {
  try {
    const contact = await tagService.attachTagToContact(req.user.id, req.params.id, req.body.name);
    res.status(200).json({ status: 'success', data: { contact } });
  } catch (error) {
    next(error);
  }
};

export const removeTagFromContact = async (req: any, res: Response, next: NextFunction) => {
  try {
    const contact = await tagService.detachTagFromContact(req.user.id, req.params.id, req.params.tagId);
    res.status(200).json({ status: 'success', data: { contact } });
  } catch (error) {
    next(error);
  }
};
