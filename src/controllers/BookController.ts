import { Request, Response } from 'express';
import BookFormatModel from '../models/BookFormatModel';
import { handleHttpError } from '../services/ErrorService';

export const createBook = async (req: Request, res: Response): Promise<void> => {
  try {
    
  } catch (error) {
    handleHttpError(error, res);
  }
};

export const getAllBook = async (req: Request, res: Response): Promise<void> => {

};

export const getBookById = async (req: Request, res: Response): Promise<void> => {

};

export const updateBook = async (req: Request, res: Response): Promise<void> => {

};

export const softDeleteBook = async (req: Request, res: Response): Promise<void> => {

};