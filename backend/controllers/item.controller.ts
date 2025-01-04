import { Request, Response, NextFunction } from "express";
import {
  CreateItemDto,
  UpdateItemDto,
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
} from "../services/item.service";
import { CreateItemRequest, UpdateItemRequest, GetItemByIdRequest } from "../lib/schemas";

export const createItemController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const itemData: CreateItemDto = req.body;
    const item = await createItem(itemData);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
};

export const getAllItemsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const items = await getAllItems();
    res.status(200).json(items);
  } catch (err) {
    next(err);
  }
};

export const getItemByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);
    const item = await getItemById(id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json(item);
  } catch (err) {
    next(err);
  }
};

export const updateItemController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);
    const itemData: UpdateItemDto = req.body;
    const item = await updateItem(id, itemData);
    res.status(200).json(item);
  } catch (err) {
    next(err);
  }
};

export const deleteItemController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);
    await deleteItem(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
