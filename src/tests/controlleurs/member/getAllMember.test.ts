import { getAllMember } from "../../../controllers/MemberController";
import MemberModel from "../../../models/MemberModel";
import { Request, Response } from "express";

jest.mock("../../../models/MemberModel");

describe("Récupère tous les membres", () => {
  const mockMembers = [
    { id: "1", firstName: "John", lastName: "Doe" },
    { id: "2", firstName: "Jane", lastName: "Doe" },
    { id: "3", firstName: "Jim", lastName: "Beam" }
  ];

  let res: Partial<Response>;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    res = {
      status: jest.fn(() => res),
      json: jsonMock
    } as Partial<Response>;
  });

  test("Doit renvoyer tous les membres", async () => {
    (MemberModel.findAll as jest.Mock).mockResolvedValue(mockMembers);

    await getAllMember(res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockMembers);
  });
});
