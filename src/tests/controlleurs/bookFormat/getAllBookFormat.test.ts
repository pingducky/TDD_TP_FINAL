import { getAllBookFormat } from "../../../controllers/BookFormat";
import BookFormatModel from "../../../models/BookFormatModel";
import { Request, Response } from "express";

jest.mock("../../../models/BookFormatModel");

describe("Récupère tous les formats de livre", () => {
  const mockBookFormats = [
    { id: "1", name: "Broché" },
    { id: "2", name: "Poche" },
    { id: "3", name: "Grand format" }
  ];

  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    req = {};
    jsonMock = jest.fn();
    res = {
      status: jest.fn(() => res),
      json: jsonMock
    } as Partial<Response>;
  });

  test("Doit renvoyer tous les formats de livre", async () => {
    (BookFormatModel.findAll as jest.Mock).mockResolvedValue(mockBookFormats);

    await getAllBookFormat(res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockBookFormats);
  });
});
