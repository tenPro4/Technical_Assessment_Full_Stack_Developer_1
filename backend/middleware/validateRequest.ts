import { Request, Response, NextFunction, RequestHandler } from "express";
import { AnyZodObject } from "zod";

export const validateRequest = (schema: AnyZodObject): RequestHandler => {
  return (req, res, next) => {
    schema
      .parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      })
      .then(() => {
        next();
      })
      .catch((error) => {
        res.status(400).json(error);
      });
  };
}; 