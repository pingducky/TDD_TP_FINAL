import { Request, Response } from 'express';
import BookFormatModel from "../models/BookFormatModel";
import { handleHttpError } from "../services/ErrorService";

export const getAllBookFormat = async (res: Response): Promise<void> => {
  try {
    const bookFormats = await BookFormatModel.findAll();
    res.status(200).json(bookFormats);
  } catch (error) {
    handleHttpError(error, res);
  }
};
