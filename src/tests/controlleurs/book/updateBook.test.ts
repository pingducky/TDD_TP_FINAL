import { updateBook } from "../../../controllers/BookController";
import { Request, Response } from "express";
import { EditorModel } from "../../../models/EditorModel";
import { AuthorModel } from "../../../models/AuthorModel";
import BookModel from "../../../models/BookModel";
import BookFormatModel from "../../../models/BookFormatModel";

jest.mock("../../../models/BookModel");
jest.mock("../../../models/EditorModel");
jest.mock("../../../models/AuthorModel");
jest.mock("../../../models/BookFormatModel");

describe("Mise à jour d'un livre", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonMock: jest.Mock;

  const mockEditor = {
    id: 1,
    name: "Editeur",
    siret: "7846716950008",
  };

  const mockAuthor = {
    id: 1,
    lastname: "Pigeon",
    firstname: "Hugo",
  };

  const mockBookFormat = {
    id: 1,
    name: "Poche",
  };

  const mockBook = {
    id: 1,
    isbn: "006196436X",
    title: "Oscar Pill",
    editorId: 1,
    formatId: 1,
    authorId: 1,
    isAvailable: true,
    update: jest.fn().mockImplementation(function (this: any, updatedFields) {
        return Promise.resolve({ ...this, ...updatedFields });
      }),
      
  };

  beforeEach(() => {
    req = {};
    jsonMock = jest.fn();
    res = {
      status: jest.fn(() => res),
      json: jsonMock,
    } as Partial<Response>;
  });

  test("Doit vérifier si l'ID du livre est fourni", async () => {
    req = {
      body: {},
    };

    await updateBook(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      error: "ID du livre requis",
    });
  });

  test("Doit vérifier si le livre existe", async () => {
    req = {
      body: {
        bookId: 999,
        title: "Mon livre mis à jour",
      },
    };

    (BookModel.findByPk as jest.Mock).mockResolvedValue(null);

    await updateBook(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(jsonMock).toHaveBeenCalledWith({
      error: "Le livre à mettre à jour n'a pas été trouvé",
    });
  });

  test("Doit vérifier si l'éditeur existe", async () => {
    req = {
      body: {
        bookId: 1,
        title: "Mon livre mis à jour",
        editorId: 999,
      },
    };

    (BookModel.findByPk as jest.Mock).mockResolvedValue(mockBook);
    (EditorModel.findByPk as jest.Mock).mockResolvedValue(null);

    await updateBook(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(jsonMock).toHaveBeenCalledWith({
      error: "L'éditeur n'a pas été trouvé",
    });
  });

  test("Doit vérifier si l'auteur existe", async () => {
    req = {
      body: {
        bookId: 1,
        title: "Mon livre mis à jour",
        authorId: 999,
      },
    };

    (BookModel.findByPk as jest.Mock).mockResolvedValue(mockBook);
    (AuthorModel.findByPk as jest.Mock).mockResolvedValue(null);

    await updateBook(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(jsonMock).toHaveBeenCalledWith({
      error: "L'auteur n'a pas été trouvé",
    });
  });

  test("Doit vérifier si le format du livre existe", async () => {
    req = {
      body: {
        bookId: 1,
        title: "Mon livre mis à jour",
        formatId: 999,
      },
    };

    (BookModel.findByPk as jest.Mock).mockResolvedValue(mockBook);
    (BookFormatModel.findByPk as jest.Mock).mockResolvedValue(null);

    await updateBook(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(jsonMock).toHaveBeenCalledWith({
      error: "Le format du livre n'a pas été trouvé",
    });
  });

  test("Doit mettre à jour le livre", async () => {
    req = {
      body: {
        bookId: 1,
        title: "Mon livre mis à jour",
        isbn: "0061964360",
        editorId: 1,
        authorId: 1,
        formatId: 1,
      },
    };

    (BookModel.findByPk as jest.Mock).mockResolvedValue(mockBook);
    (EditorModel.findByPk as jest.Mock).mockResolvedValue(mockEditor);
    (AuthorModel.findByPk as jest.Mock).mockResolvedValue(mockAuthor);
    (BookFormatModel.findByPk as jest.Mock).mockResolvedValue(mockBookFormat);

    (BookModel.update as jest.Mock).mockResolvedValue([1, [mockBook]]);

    await updateBook(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
        message: "Livre mis à jour avec succès",
        data: {
          ...mockBook,
          title: "Mon livre mis à jour",
          isbn: "0061964360",
        },
      });
      
  });
});
