import type { Response } from "express";


export const sendSuccess = (
  res: Response,
  statusCode: number,
  message: string,
  data?: unknown,
): void => {
  const payload: Record<string, unknown> = { success: true, message };
  if (data !== undefined) payload.data = data;
  res.status(statusCode).json(payload);
};

export const sendError = (
  res: Response,
  statusCode: number,
  message: string,
  errors?: unknown,
): void => {
  const payload: Record<string, unknown> = { success: false, message };
  if (errors !== undefined) payload.errors = errors;
  res.status(statusCode).json(payload);
};