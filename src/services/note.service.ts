import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/appError.js';

const prisma = new PrismaClient();

export const createNote = async (userId: string, contactId: string, content: string) => {
  const contact = await prisma.contact.findFirst({
    where: { id: contactId, userId },
  });

  if (!contact) throw new AppError('Contact not found', 404);

  return await prisma.note.create({
    data: {
      content,
      contactId,
    },
  });
};

export const getNotesForContact = async (userId: string, contactId: string) => {
  const contact = await prisma.contact.findFirst({
    where: { id: contactId, userId },
  });

  if (!contact) throw new AppError('Contact not found', 404);

  return await prisma.note.findMany({
    where: { contactId },
    orderBy: { createdAt: 'desc' },
  });
};

export const updateNote = async (userId: string, noteId: string, content: string) => {
  const note = await prisma.note.findFirst({
    where: {
      id: noteId,
      contact: { userId },
    },
  });

  if (!note) throw new AppError('Note not found', 404);

  return await prisma.note.update({
    where: { id: noteId },
    data: { content },
  });
};

export const deleteNote = async (userId: string, noteId: string) => {
  const note = await prisma.note.findFirst({
    where: {
      id: noteId,
      contact: { userId },
    },
  });

  if (!note) throw new AppError('Note not found', 404);

  await prisma.note.delete({ where: { id: noteId } });
  return true;
};
