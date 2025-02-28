jest.mock("../../../models/MemberModel");
import { Response, Request } from "express";
import MemberModel from "../../../models/MemberModel";
import { getMemberById } from "../../../controllers/MemberController";

jest.mock("../../../models/MemberModel");

describe("Récupération d'un membre", () => {
  const mockMember = {
    id: 2,
    name: "John Doe",
    email: "john.doe@example.com",
    membershipDate: "2021-05-01",
    isActive: true,
  };

  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    req = {};
    jsonMock = jest.fn();
    statusMock = jest.fn(() => res);
    res = {
      status: statusMock,
      json: jsonMock,
    } as Partial<Response>;
  });

  test("Doit renvoyer une erreur 400 si l'id est absent", async () => {
    req = {
      params: {},
    };

    (MemberModel.findByPk as jest.Mock).mockResolvedValue(null);

    await getMemberById(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      error: "Le champs id est manquant",
    });
  });

  test("Doit renvoyer une erreur 404 si le membre n'est pas trouvé", async () => {
    req = {
      params: {
        id: "3",
      },
    };

    (MemberModel.findByPk as jest.Mock).mockResolvedValue(null);

    await getMemberById(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(404);
    expect(jsonMock).toHaveBeenCalledWith({
      error: "Membre non trouvé",
    });
  });

  test("Doit renvoyer un membre par son ID", async () => {
    req = {
      params: {
        id: "2",
      },
    };

    (MemberModel.findByPk as jest.Mock).mockResolvedValue(mockMember);

    await getMemberById(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith(mockMember);
  });
});
