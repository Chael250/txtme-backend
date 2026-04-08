import type { Response, NextFunction } from 'express';
import * as aiService from '../services/ai.service.js';
import * as contactService from '../services/contact.service.js';

export const aiSearch = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({
        status: 'fail',
        message: 'Query is required',
      });
    }

    const parsedFilters = await aiService.parseQuery(query);
    const contacts = await contactService.smartSearch(req.user.id, parsedFilters, query);

    res.status(200).json({
      status: 'success',
      results: contacts.length,
      data: {
        filters: parsedFilters,
        contacts,
      },
    });
  } catch (error) {
    next(error);
  }
};
