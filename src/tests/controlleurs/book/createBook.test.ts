import { getAllBookFormat } from "../../../controllers/BookFormat";
import BookFormatModel from "../../../models/BookFormatModel";
import { Request, Response } from "express";

jest.mock("../../../models/BookFormatModel");

describe("Creer un livre", () => {
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

  test("", async () => {

  });
});
