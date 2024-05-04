import { Users } from '@/lib/types';
import prisma from './prisma';

export const readUser = async () => {
  return await prisma.users.findMany();
};

export const readSpecificUser = async (id: string) => {
  return await prisma.users.findUnique({
    where: { auth0Id: id ?? '' },
    include: { expenses: true, dailySummaries: true },
  });
};

export const createUser = async (user: Users) => {
  const { auth0Id, email, username } = user;
  const createdUser = await prisma.users.create({
    data: { auth0Id, email, username },
  });
  return createdUser;
};

export const existingUser = async (email: string) => {
  return prisma.users.findUnique({ where: { email: email } });
};
