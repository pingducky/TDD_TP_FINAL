jest.mock("../../../models/BookModel");
import { Response } from "express";
import BookModel from "../../../models/BookModel";
import { getAllBook } from "../../../controllers/BookController";

describe("Récupération de tout les livres", () => {
    const mockBooks = [
        {
        id: 1,
        isbn: "0-061-96436-0",
        title: "Oscar Pill Tom 1",
        editorId: 1,
        formatId: 1,
        authorId: 1,
        isAvailable: true,
      },
      {
        id: 2,
        isbn: "0-061-96436-0",
        title: "Oscar Pill Tom 2",
        editorId: 1,
        formatId: 1,
        authorId: 1,
        isAvailable: false,
      }
    ];
    
  let res: Partial<Response>;
  let jsonMock: jest.Mock;

    beforeEach(() => {
      jsonMock = jest.fn();
      res = {
        status: jest.fn(() => res),
        json: jsonMock,
      } as Partial<Response>;
    });
  
    test("Doit renvoyer tous les formats de livre", async () => {
        (BookModel.findAll as jest.Mock).mockResolvedValue(mockBooks);
    
        await getAllBook(res as Response);
    
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockBooks);
      });
});
