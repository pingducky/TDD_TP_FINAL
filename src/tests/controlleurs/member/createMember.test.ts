import { createMember } from "../../../controllers/MemberController";
import { Request, Response } from "express";
import MemberModel from "../../../models/MemberModel";

jest.mock("../../../models/MemberModel");

describe("Création d'un membre", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonMock: jest.Mock;

  const mockMember = {
    id: 1,
    lastName: "Dupont",
    firstName: "Jean",
    email: "jean.dupont@example.com",
  };

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

    await createMember(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      error: expect.stringContaining("Champs requis manquants"),
    });
  });

  test("Doit retourner une erreur 400 si un champ obligatoire est manquant", async () => {
    req = {
      body: {
        lastName: "Dupont",
        firstName: "Jean",
      },
    };

    await createMember(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      error: expect.stringContaining("Champs requis manquants"),
    });
  });

  test("Doit vérifier si l'email est déjà utilisé et retourner une erreur 409", async () => {
    req = {
      body: {
        lastName: "Dupont",
        firstName: "Jean",
        email: "jean.dupont@example.com",
      },
    };

    (MemberModel.findOne as jest.Mock).mockResolvedValue(mockMember);

    await createMember(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(jsonMock).toHaveBeenCalledWith({
      error: "Un membre avec cet email existe déjà",
    });
  });

  test("Doit créer un membre (adhérent)", async () => {
    req = {
      body: {
        lastName: "Dupont",
        firstName: "Jean",
        email: "jean.dupont@example.com",
      },
    };

    (MemberModel.findOne as jest.Mock).mockResolvedValue(null);
    (MemberModel.create as jest.Mock).mockResolvedValue(mockMember);

    await createMember(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(jsonMock).toHaveBeenCalledWith({
      message: "Membre créé avec succès",
      data: mockMember,
    });
  });
});
