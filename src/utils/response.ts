import { Response } from 'express';

export const sendSuccess = (res: Response, data: any, message?: string) => {
  res.json({
    success: true,
    message,
    data
  });
};

export const sendError = (res: Response, message: string, statusCode = 500) => {
  res.status(statusCode).json({
    success: false,
    error: message
  });
};