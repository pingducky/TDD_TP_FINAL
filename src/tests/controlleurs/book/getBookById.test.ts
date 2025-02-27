jest.mock("../../../models/BookModel");
import { Response, Request } from "express";
import BookModel from "../../../models/BookModel";
import { getBookById } from "../../../controllers/BookController";

jest.mock("../../../models/BookModel");

describe("Récupération d'un livre", () => {
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

  test("Doit renvoyer une erreur 400 si l'id est absent", async () => {
    req = {
      body: {},
    };

    (BookModel.findByPk as jest.Mock).mockResolvedValue(null); 

    await getBookById(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "L'id du livre est manquant ou invalide",
    });
  });

  test("Doit renvoyer un livre par son ID", async () => {
    req = {
      body: {
        id: "2", 
      },
    };

    (BookModel.findByPk as jest.Mock).mockResolvedValue(mockBook); 

    await getBookById(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200); 
    expect(res.json).toHaveBeenCalledWith(mockBook); 
  });
});
