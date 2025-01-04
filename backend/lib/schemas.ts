import { z } from "zod";

export const createItemSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100),
    description: z.string().max(500).optional(),
    price: z.number().min(0).nonnegative(),
  }),
});

export const updateItemSchema = z.object({
  params: z.object({
    id: z.string().transform((val) => parseInt(val, 10)),
  }),
  body: z.object({
    name: z.string().min(1).max(100).optional(),
    description: z.string().max(500).optional(),
    price: z.number().min(0).nonnegative().optional(),
  }),
});

export const getItemByIdSchema = z.object({
  params: z.object({
    id: z.string().transform((val) => parseInt(val, 10)),
  }),
});

export const deleteManySchema = z.object({
  body: z.object({
    ids: z.array(z.number()),
  }),
});

// Type definitions for validated request objects
export type CreateItemRequest = z.infer<typeof createItemSchema>;
export type UpdateItemRequest = z.infer<typeof updateItemSchema>;
export type GetItemByIdRequest = z.infer<typeof getItemByIdSchema>;
