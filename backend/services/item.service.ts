import prisma from '../lib/db';

export interface CreateItemDto {
  name: string;
  description?: string;
  price: number;
}

export interface UpdateItemDto {
  name?: string;
  description?: string;
  price?: number;
}

export const createItem = async (data: CreateItemDto) => {
  return prisma.item.create({
    data: data,
  });
};

export const getAllItems = async () => {
  return prisma.item.findMany();
};

export const getItemById = async (id: number) => {
  return prisma.item.findUnique({
    where: { id },
  });
};

export const updateItem = async (id: number, data: UpdateItemDto) => {
  return prisma.item.update({
    where: { id },
    data: data,
  });
};

export const deleteItem = async (id: number) => {
  return prisma.item.delete({
    where: { id },
  });
};

export const deleteMany = async (ids: number[]) => {
  return prisma.item.deleteMany({
    where: {
      id: {
        in: ids,
      },
    },
  });
};