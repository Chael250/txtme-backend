import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/appError.js';

const prisma = new PrismaClient();

export const createTag = async (userId: string, name: string) => {
  const existingTag = await prisma.tag.findUnique({
    where: {
      name_userId: { name, userId },
    },
  });

  if (existingTag) return existingTag;

  return await prisma.tag.create({
    data: { name, userId },
  });
};

export const getAllTags = async (userId: string) => {
  return await prisma.tag.findMany({
    where: { userId },
    include: {
      _count: {
        select: { contacts: true },
      },
    },
  });
};

export const deleteTag = async (userId: string, id: string) => {
  const tag = await prisma.tag.findFirst({ where: { id, userId } });
  if (!tag) throw new AppError('Tag not found', 404);

  await prisma.tag.delete({ where: { id } });
  return true;
};

export const attachTagToContact = async (userId: string, contactId: string, tagName: string) => {
  const contact = await prisma.contact.findFirst({ where: { id: contactId, userId } });
  if (!contact) throw new AppError('Contact not found', 404);

  // Find or create tag
  const tag = await createTag(userId, tagName);

  return await prisma.contact.update({
    where: { id: contactId },
    data: {
      tags: {
        connect: { id: tag.id },
      },
    },
    include: { tags: true },
  });
};

export const detachTagFromContact = async (userId: string, contactId: string, tagId: string) => {
  const contact = await prisma.contact.findFirst({ where: { id: contactId, userId } });
  if (!contact) throw new AppError('Contact not found', 404);

  return await prisma.contact.update({
    where: { id: contactId },
    data: {
      tags: {
        disconnect: { id: tagId },
      },
    },
    include: { tags: true },
  });
};
