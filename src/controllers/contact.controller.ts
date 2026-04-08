import type { Response, NextFunction } from 'express';
import * as contactService from '../services/contact.service.js';

export const createContact = async (req: any, res: Response, next: NextFunction) => {
  try {
    const contact = await contactService.createContact(req.user.id, req.body);
    res.status(201).json({ status: 'success', data: { contact } });
  } catch (error) {
    next(error);
  }
};

export const getAllContacts = async (req: any, res: Response, next: NextFunction) => {
  try {
    const contacts = await contactService.getAllContacts(req.user.id);
    res.status(200).json({ status: 'success', results: contacts.length, data: { contacts } });
  } catch (error) {
    next(error);
  }
};

export const getContact = async (req: any, res: Response, next: NextFunction) => {
  try {
    const contact = await contactService.getContactById(req.user.id, req.params.id);
    res.status(200).json({ status: 'success', data: { contact } });
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req: any, res: Response, next: NextFunction) => {
  try {
    const contact = await contactService.updateContact(req.user.id, req.params.id, req.body);
    res.status(200).json({ status: 'success', data: { contact } });
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req: any, res: Response, next: NextFunction) => {
  try {
    await contactService.deleteContact(req.user.id, req.params.id);
    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    next(error);
  }
};

export const searchContacts = async (req: any, res: Response, next: NextFunction) => {
  try {
    const query = req.query.q as string;
    const contacts = await contactService.searchContacts(req.user.id, query || '');
    res.status(200).json({ status: 'success', results: contacts.length, data: { contacts } });
  } catch (error) {
    next(error);
  }
};

export const filterContacts = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { tag, company, date } = req.query;
    const contacts = await contactService.filterContacts(req.user.id, { tag, company, date });
    res.status(200).json({ status: 'success', results: contacts.length, data: { contacts } });
  } catch (error) {
    next(error);
  }
};

export const getRecentContacts = async (req: any, res: Response, next: NextFunction) => {
  try {
    const contacts = await contactService.getRecentContacts(req.user.id);
    res.status(200).json({ status: 'success', results: contacts.length, data: { contacts } });
  } catch (error) {
    next(error);
  }
};

export const getFavoriteContacts = async (req: any, res: Response, next: NextFunction) => {
  try {
    const contacts = await contactService.getFavoriteContacts(req.user.id);
    res.status(200).json({ status: 'success', results: contacts.length, data: { contacts } });
  } catch (error) {
    next(error);
  }
};
