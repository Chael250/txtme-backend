import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/appError.js';

const prisma = new PrismaClient();

export const createContact = async (userId: string, data: any) => {
  return await prisma.contact.create({
    data: {
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
      phone: data.phone,
      address: data.address,
      company: data.company,
      isFavorite: data.favorite ?? data.isFavorite ?? false,
      userId,
    },
    include: {
      tags: true,
      notes: true,
    },
  });
};

export const getAllContacts = async (userId: string) => {
  return await prisma.contact.findMany({
    where: { userId },
    include: {
      tags: true,
      notes: {
        take: 1,
        orderBy: { createdAt: 'desc' },
      },
    },
    orderBy: { lastname: 'asc' },
  });
};

export const getContactById = async (userId: string, id: string) => {
  const contact = await prisma.contact.findFirst({
    where: { id, userId },
    include: {
      tags: true,
      notes: true,
    },
  });

  if (!contact) {
    throw new AppError('Contact not found', 404);
  }

  return contact;
};

export const updateContact = async (userId: string, id: string, data: any) => {
  const contact = await prisma.contact.findFirst({ where: { id, userId } });
  if (!contact) throw new AppError('Contact not found', 404);

  return await prisma.contact.update({
    where: { id },
    data: {
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
      phone: data.phone,
      address: data.address,
      company: data.company,
      isFavorite: data.favorite ?? data.isFavorite,
    },
    include: {
      tags: true,
      notes: true,
    },
  });
};

export const deleteContact = async (userId: string, id: string) => {
  const contact = await prisma.contact.findFirst({ where: { id, userId } });
  if (!contact) throw new AppError('Contact not found', 404);

  await prisma.contact.delete({ where: { id } });
  return true;
};

export const searchContacts = async (userId: string, query: string) => {
  return await prisma.contact.findMany({
    where: {
      userId,
      OR: [
        { firstname: { contains: query, mode: 'insensitive' } },
        { lastname: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } },
        { company: { contains: query, mode: 'insensitive' } },
      ],
    },
    include: { tags: true },
  });
};

export const filterContacts = async (userId: string, filters: any) => {
  const { tag, company, date } = filters;
  
  const where: any = { userId };
  
  if (tag) {
    where.tags = {
      some: {
        name: { equals: tag, mode: 'insensitive' },
      },
    };
  }
  
  if (company) {
    where.company = { contains: company, mode: 'insensitive' };
  }
  
  if (date) {
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);
    
    where.createdAt = {
      gte: startDate,
      lt: endDate,
    };
  }

  return await prisma.contact.findMany({
    where,
    include: { tags: true },
  });
};

export const getRecentContacts = async (userId: string) => {
  return await prisma.contact.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
    take: 10,
    include: { tags: true },
  });
};

export const getFavoriteContacts = async (userId: string) => {
  return await prisma.contact.findMany({
    where: { userId, isFavorite: true },
    include: { tags: true },
    orderBy: { lastname: 'asc' },
  });
};
export const smartSearch = async (userId: string, filters: any, originalQuery: string) => {
  const where: any = { userId };
  const orConditions: any[] = [];

  if (filters.name) {
    orConditions.push({ firstname: { contains: filters.name, mode: 'insensitive' } });
    orConditions.push({ lastname: { contains: filters.name, mode: 'insensitive' } });
  }

  if (filters.company) {
    orConditions.push({ company: { contains: filters.company, mode: 'insensitive' } });
  }

  if (filters.location) {
    orConditions.push({ address: { contains: filters.location, mode: 'insensitive' } });
    orConditions.push({
      notes: {
        some: {
          content: { contains: filters.location, mode: 'insensitive' },
        },
      },
    });
  }

  if (filters.role) {
    orConditions.push({
      notes: {
        some: {
          content: { contains: filters.role, mode: 'insensitive' },
        },
      },
    });
  }

  // If no structured filters were found, fall back to basic query search
  if (orConditions.length === 0 && originalQuery) {
    orConditions.push({ firstname: { contains: originalQuery, mode: 'insensitive' } });
    orConditions.push({ lastname: { contains: originalQuery, mode: 'insensitive' } });
    orConditions.push({ email: { contains: originalQuery, mode: 'insensitive' } });
    orConditions.push({ company: { contains: originalQuery, mode: 'insensitive' } });
  }

  if (orConditions.length > 0) {
    where.OR = orConditions;
  }

  return await prisma.contact.findMany({
    where,
    include: {
      tags: true,
      notes: {
        take: 3,
        orderBy: { createdAt: 'desc' },
      },
    },
  });
};
