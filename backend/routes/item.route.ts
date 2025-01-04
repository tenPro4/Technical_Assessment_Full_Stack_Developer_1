import { Router } from "express";
import {
  createItemController,
  getAllItemsController,
  getItemByIdController,
  updateItemController,
  deleteItemController,
  deleteManyController,
} from "../controllers/item.controller";
import { RequestHandler } from "express";
import { validateRequest } from "../middleware/validateRequest";
import { createItemSchema, updateItemSchema, getItemByIdSchema, deleteManySchema } from "../lib/schemas";

const router = Router();

router.post('/', validateRequest(createItemSchema), createItemController as RequestHandler);
router.get('/', getAllItemsController as RequestHandler);
router.delete('/batch', validateRequest(deleteManySchema), deleteManyController as RequestHandler);
router.get('/:id', validateRequest(getItemByIdSchema), getItemByIdController as RequestHandler);
router.put('/:id', validateRequest(updateItemSchema), updateItemController as RequestHandler);
router.delete('/:id', validateRequest(getItemByIdSchema), deleteItemController as RequestHandler);

export default router;