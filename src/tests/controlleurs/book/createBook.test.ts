import { createBook } from "../../../controllers/BookController";
import { Request, Response } from "express";
import { EditorModel } from "../../../models/EditorModel";
import { AuthorModel } from "../../../models/AuthorModel";
import BookModel from "../../../models/BookModel";
import BookFormatModel from "../../../models/BookFormatModel";

jest.mock("../../../models/BookModel");
jest.mock("../../../models/EditorModel");
jest.mock("../../../models/AuthorModel");
jest.mock("../../../models/BookFormatModel")

describe("Création d'un livre", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonMock: jest.Mock;

  const mockEditor = {
    id: 1,
    name: "Editeur",
    siret: "7846716950008"
  }

  const mockAuthor = {
    id: 1,
    lastname: "Pigeon",
    firstname: "Hugo"
  }

  const mockBookFormat = {
    id: 1,
    name: "Poche"
  }

  const mockBook = {
    id: 1,
    isbn: "0-061-96436-0",
    title: "Oscar Pill",
    editorId: 1,
    formatId: 1,
    authorId: 1,
    isAvailable: true,
  }


  beforeEach(() => {
    req = {};
    jsonMock = jest.fn();
    res = {
      status: jest.fn(() => res),
      json: jsonMock,
    } as Partial<Response>;
  });

  test("Doit vérifier les champs obligatoires et retourner une erreur 400", async () => {
    req = {
      body: {},
    };

    await createBook(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      error: expect.stringContaining("Champs requis manquants"),
    });
  });

  test("Doit retourner une erreur 400 si un champ obligatoire est manquant", async () => {
    req = {
      body: {
        title: "Mon livre",
        isbn: "0-061-96436-0",
        editorId: 1,
      },
    };

    await createBook(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      error: expect.stringContaining("Champs requis manquants"),
    });
  });

  test("Doit vérifier si un éditeur avec l'editorId existe bien.", async () => {
    req = {
        body: {
          title: "Mon livre",
          isbn: "0-061-96436-0",
          editorId: 666,
          authorId: 1,
          formatId: 1,

        },
      };

    (EditorModel.findByPk as jest.Mock).mockResolvedValue(null);
    (AuthorModel.findByPk as jest.Mock).mockResolvedValue(mockAuthor);
    (BookFormatModel.findByPk as jest.Mock).mockResolvedValue(mockBookFormat);

    await createBook(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(jsonMock).toHaveBeenCalledWith({
        error: "L'éditeur n'a pas été trouvé",
    });
  });

  test("Doit vérifier si un autheur avec l'authorId existe bien.", async () => {
    req = {
        body: {
          title: "Mon livre",
          isbn: "0-061-96436-0",
          editorId: 1,
          authorId: 666,
          formatId: 1,
        },
      };

    (EditorModel.findByPk as jest.Mock).mockResolvedValue(mockEditor);
    (AuthorModel.findByPk as jest.Mock).mockResolvedValue(null);
    (BookFormatModel.findByPk as jest.Mock).mockResolvedValue(mockBookFormat);

    await createBook(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(jsonMock).toHaveBeenCalledWith({
        error: "L'auteur n'a pas été trouvé",
    });
  });

  test("Doit vérifier si un format de livre avec le formatId existe bien.", async () => {
    req = {
        body: {
          title: "Mon livre",
          isbn: "0-061-96436-0",
          editorId: 1,
          authorId: 1,
          formatId: 666,
        },
      };

    (EditorModel.findByPk as jest.Mock).mockResolvedValue(mockEditor);
    (AuthorModel.findByPk as jest.Mock).mockResolvedValue(mockAuthor);
    (BookFormatModel.findByPk as jest.Mock).mockResolvedValue(null);

    await createBook(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(jsonMock).toHaveBeenCalledWith({
        error: "Le format du livre n'a pas été trouvé",
    });
  });

  test("Doit vérifier si un livre avec un ISBN similaire n'existe pas déja.", async () => {
    req = {
        body: {
          title: "Mon livre",
          isbn: "0-061-96436-0",
          editorId: 1,
          authorId: 1,
          formatId: 666,
        },
      };

    (EditorModel.findByPk as jest.Mock).mockResolvedValue(mockEditor);
    (AuthorModel.findByPk as jest.Mock).mockResolvedValue(mockAuthor);
    (BookFormatModel.findByPk as jest.Mock).mockResolvedValue(mockBookFormat);
    (BookModel.findOne as jest.Mock).mockResolvedValue(mockBook);


    await createBook(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(409);
    expect(jsonMock).toHaveBeenCalledWith({
        error: "Le livre existe déja",
    });
  });

  test("Doit vérifier si l'ISBN est valide", async () => {
    req = {
        body: {
          title: "Mon livre",
          isbn: "978-0-596-52068-7dsdsdsdd",
          editorId: 1,
          authorId: 1,
          formatId: 666,
        },
      };

    (EditorModel.findByPk as jest.Mock).mockResolvedValue(mockEditor);
    (AuthorModel.findByPk as jest.Mock).mockResolvedValue(mockAuthor);
    (BookFormatModel.findByPk as jest.Mock).mockResolvedValue(mockBookFormat);

    await createBook(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
        error: "ISBN invalide",
    });
  });

  test("Doit créer un livre", async () => {
    req = {
      body: {
        title: "Mon livre",
        isbn: "0-061-96436-0",
        editorId: 1,
        authorId: 1,
        formatId: 1,
      },
    };
  
    (EditorModel.findByPk as jest.Mock).mockResolvedValue(mockEditor);
    (AuthorModel.findByPk as jest.Mock).mockResolvedValue(mockAuthor);
    (BookFormatModel.findByPk as jest.Mock).mockResolvedValue(mockBookFormat);
    (BookModel.findOne as jest.Mock).mockResolvedValue(null); // Aucun livre existant avec cet ISBN
  
    // Mocker la création du livre
    (BookModel.create as jest.Mock).mockResolvedValue(mockBook);
  
    await createBook(req as Request, res as Response);
  
    expect(res.status).toHaveBeenCalledWith(201);
    expect(jsonMock).toHaveBeenCalledWith({
      message: "Livre créé avec succès",
      data: mockBook,
    });
  });
});
