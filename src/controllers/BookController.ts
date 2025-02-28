import { Request, Response } from 'express';
import { handleHttpError } from '../services/ErrorService';
import { BadRequestError } from '../errors/BadRequestError';
import { EditorModel } from '../models/EditorModel';
import { NotFoundError } from '../errors/NotFoundError';
import { AuthorModel } from '../models/AuthorModel';
import BookFormatModel from '../models/BookFormatModel';
import BookModel from '../models/BookModel';
import { ConflictError } from '../errors/ConflictError';
import { BookService } from '../services/BookService';
import { IBookWebService } from '../services/BookWebService/IBookWebService';

export const createBook = async (req: Request, res: Response, bookWebService: IBookWebService): Promise<void> => {
  try {
    const { title, isbn, editorId, formatId, authorId } = req.body;

    const missingFields = [];
    if (!title) missingFields.push("title");
    if (!isbn) missingFields.push("isbn");
    if (!editorId) missingFields.push("editorId");
    if (!formatId) missingFields.push("formatId");
    if (!authorId) missingFields.push("authorId");

    if (missingFields.length > 0) {
      throw new BadRequestError(`Champs requis manquants: ${missingFields.join(", ")}`);
    }

    try {
      !BookService.isIsbnValid(isbn)
    } catch (error) {
      throw new BadRequestError('ISBN invalide');
    }

    const editor = await EditorModel.findByPk(editorId); 
    if (!editor) { 
      throw new NotFoundError("L'éditeur n'a pas été trouvé");
    }

    const author = await AuthorModel.findByPk(authorId)
    if (!author) { 
      throw new NotFoundError("L'auteur n'a pas été trouvé");
    }

    const bookFormat = await BookFormatModel.findByPk(formatId)
    if (!bookFormat) { 
      throw new NotFoundError("Le format du livre n'a pas été trouvé");
    }

    const book = await BookModel.findOne({where: { isbn: isbn}})
    if (book) {
      throw new ConflictError("Le livre existe déja")
    }

    // Todo : utiliser le bookWebService et appeller getBookInformation pour récupérer des informations qui seraient manquante à la création du livre
  
    const newBook = await BookModel.create({
      isbn,
      title,
      editorId,
      formatId,
      authorId,
      isAvailable: true,
    });

    res.status(201).json({
      message: "Livre créé avec succès",
      data: newBook,
    });
  } catch (error) {
    handleHttpError(error, res);
  }
};

export const getAllBook = async (res: Response): Promise<void> => {
  try {
    const bookFormats = await BookModel.findAll();
    res.status(200).json(bookFormats);
  } catch (error) {
    handleHttpError(error, res);
  }
};

export const getBookById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.body;

    if (!id) {
      throw new BadRequestError("L'id du livre est manquant ou invalide")
    }

    const book = await BookModel.findByPk(id);
    res.status(200).json(book);
  } catch (error) {
    handleHttpError(error, res);
  }
};

export const getBookByIsbn = async (req: Request, res: Response): Promise<void> => {
  try {
    const { isbn } = req.body;

    if (!isbn) {
      throw new BadRequestError("L'isbn du livre est manquant")
    }

    try {
      !BookService.isIsbnValid(isbn)
    } catch (error) {
      throw new BadRequestError('ISBN invalide');
    }

    const book = await BookModel.findOne({where: { isbn: isbn}})

    res.status(200).json(book);
  } catch (error) {
    handleHttpError(error, res);
  }
};

export const updateBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const { bookId, title, isbn, editorId, formatId, authorId } = req.body;

    if (!bookId) {
      throw new BadRequestError("ID du livre requis");
    }

    if (isbn && !BookService.isIsbnValid(isbn)) {
      throw new BadRequestError('ISBN invalide');
    }

    const book = await BookModel.findByPk(bookId);
    if (!book) {
      throw new NotFoundError("Le livre à mettre à jour n'a pas été trouvé");
    }

    const editor = await EditorModel.findByPk(editorId);
    if (editorId && !editor) {
      throw new NotFoundError("L'éditeur n'a pas été trouvé");
    }

    const author = await AuthorModel.findByPk(authorId);
    if (authorId && !author) {
      throw new NotFoundError("L'auteur n'a pas été trouvé");
    }

    const bookFormat = await BookFormatModel.findByPk(formatId);
    if (formatId && !bookFormat) {
      throw new NotFoundError("Le format du livre n'a pas été trouvé");
    }

    const updatedBook = await book.update({
      title: title || book.title,
      isbn: isbn || book.isbn,
      editorId: editorId || book.editorId,
      formatId: formatId || book.formatId,
      authorId: authorId || book.authorId,
    });

    res.status(200).json({
      message: "Livre mis à jour avec succès",
      data: updatedBook,
    });
  } catch (error) {
    handleHttpError(error, res);
  }
};


export const deleteBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.body;

    if (!id) {
      throw new BadRequestError("L'id du livre est manquant ou invalide")
    }

    const book = await BookModel.findByPk(id);

    if (!book) {
      throw new NotFoundError("Livre non trouvé");
    }
    await book.destroy();

    res.status(200).json({ message: "Livre supprimé avec succès" });

  } catch(error) {
    handleHttpError(error, res);
  }
};