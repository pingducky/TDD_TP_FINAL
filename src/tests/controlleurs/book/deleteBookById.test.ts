jest.mock("../../../models/BookModel");
import { Response, Request } from "express";
import BookModel from "../../../models/BookModel";
import { deleteBook } from "../../../controllers/BookController";

jest.mock("../../../models/BookModel");

describe("Suppression d'un livre", () => {
  const mockBook = {
    id: 2,
    isbn: "0-061-96436-0",
    title: "Oscar Pill Tom 2",
    editorId: 1,
    formatId: 1,
    authorId: 1,
    isAvailable: false,
    destroy: jest.fn(),
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

  test("Doit renvoyer une erreur 400 si l'id est manquant", async () => {
    req = {
      body: {},
    };

    await deleteBook(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "L'id du livre est manquant ou invalide",
    });
  });

  test("Doit renvoyer une erreur 404 si le livre n'est pas trouvé", async () => {
    req = {
      body: { id: 2 },
    };

    (BookModel.findByPk as jest.Mock).mockResolvedValue(null); // Aucun livre trouvé

    await deleteBook(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: "Livre non trouvé",
    });
  });

  test("Doit supprimer le livre et renvoyer un message de succès", async () => {
    req = {
      body: { id: 2 },
    };

    (BookModel.findByPk as jest.Mock).mockResolvedValue(mockBook);

    await deleteBook(req as Request, res as Response);

    expect(mockBook.destroy).toHaveBeenCalledTimes(1); 
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Livre supprimé avec succès" });
  });
});
