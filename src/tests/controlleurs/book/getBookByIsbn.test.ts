jest.mock("../../../models/BookModel");
import { Response, Request } from "express";
import BookModel from "../../../models/BookModel";
import { getBookByIsbn } from "../../../controllers/BookController";

jest.mock("../../../models/BookModel");

describe("Récupération d'un livre par ISBN", () => {
  const mockBook = {
    id: 2,
    isbn: "0-061-96436-0",
    title: "Oscar Pill Tom 2",
    editorId: 1,
    formatId: 1,
    authorId: 1,
    isAvailable: false,
  };

  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    req = {};
    jsonMock = jest.fn();
    res = {
      status: jest.fn(() => res),
      json: jsonMock,
    } as Partial<Response>;
  });

  test("Doit renvoyer une erreur 400 si l'ISBN est absent", async () => {
    req = {
      body: {},
    };

    await getBookByIsbn(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "L'isbn du livre est manquant",
    });
  });

  test("Doit renvoyer une erreur 400 si l'ISBN est invalide", async () => {
    req = {
      body: {
        isbn: "invalid-isbn",
      },
    };

    (BookModel.findOne as jest.Mock).mockResolvedValue(null); 

    await getBookByIsbn(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "ISBN invalide",
    });
  });

  test("Doit renvoyer un livre par son ISBN", async () => {
    req = {
      body: {
        isbn: "0-061-96436-0",
      },
    };

    (BookModel.findOne as jest.Mock).mockResolvedValue(mockBook);

    await getBookByIsbn(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockBook);
  });
});
