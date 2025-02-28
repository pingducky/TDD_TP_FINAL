import { Request, Response } from "express";
import ReservationModel from "../../../models/ReservationModel";
import BookModel from "../../../models/BookModel";
import { createBooking } from "../../../controllers/BookingController";
import { ReservationBookModel } from "../../../models/ReservationBookModel";
import MemberModel from "../../../models/MemberModel";

jest.mock("../../../models/ReservationModel");
jest.mock("../../../models/ReservationBookModel");
jest.mock("../../../models/BookModel");
jest.mock("../../../models/MemberModel");

describe("Création d'une réservation", () => {
    const mockMember = {
        id: 1,
        lastname: "Pigeon",
        firstname: "Hugo"
    }
    
    const mockBook = {
        id: 1,
        isbn: "0-061-96436-0",
        title: "Oscar Pill",
        editorId: 1,
        formatId: 1,
        authorId: 1,
        isAvailable: true,
      }

    let req: Partial<Request>;
    let res: Partial<Response>;
    let jsonMock: jest.Mock;

    const dateNow = new Date();
    const fourMonthsLater = new Date(dateNow);
    fourMonthsLater.setMonth(fourMonthsLater.getMonth() + 4);
    
    const mockReservation = {
        id: 1,
        memberId: 1,
        bookId: 1,
        startDate: new Date(),
        endDate: fourMonthsLater,
    };
    

    beforeEach(() => {
        jest.resetAllMocks();
        req = {};
        jsonMock = jest.fn();
        res = {
          status: jest.fn(() => res),
          json: jsonMock,
        } as Partial<Response>;
      });

    test("Ne doit pas créer de réservation si il manque des champs requis", async () => {
        req = {
            body: {},
        };

        await createBooking(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(jsonMock).toHaveBeenCalledWith({
            error: "Champs requis manquants",
        });
    });

    test("Ne doit pas créer de réservation si le membre n\'existe pas.", async () => {
        req = {
            body: {
                memberId: 666,
                bookId: 1,
            },
        };

        (BookModel.findByPk as jest.Mock).mockResolvedValue(mockBook);
        await createBooking(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(jsonMock).toHaveBeenCalledWith({
            error: "Le membre n\'existe pas",
        });
    });

    test("Ne doit pas créer de réservation si le livre n\'existe pas.", async () => {
        req = {
            body: {
                memberId: 1,
                bookId: 666,
            },
        };

        (MemberModel.findByPk as jest.Mock).mockResolvedValue(mockMember);

        await createBooking(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(jsonMock).toHaveBeenCalledWith({
            error: "Le livre n\'existe pas",
        });
    });
    
    test("Ne doit pas créer de réservation si l'adhérent en a déjà 3 en cours", async () => {
        req = {
            body: {
                memberId: 1,
                bookId: 1,
            },
        };

        // Mock de la vérification du nombre de réservations actives pour l'adhérent
        (ReservationModel.count as jest.Mock).mockResolvedValue(3);
        (MemberModel.findByPk as jest.Mock).mockResolvedValue(mockMember);
        (BookModel.findByPk as jest.Mock).mockResolvedValue(mockBook);

        await createBooking(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(jsonMock).toHaveBeenCalledWith({
            error: "Vous avez déjà 3 réservations en cours",
        });
    });

    test("La date limite de la réservation doit être de 4 mois après la création de celle-ci", async () => {
        req = {
            body: {
                memberId: 1,
                bookId: 1,
            },
        };

        const fourMonthsLater = new Date();
        fourMonthsLater.setMonth(fourMonthsLater.getMonth() + 4); // Date dans 4 mois

        // Mock de la création d'une réservation
        (ReservationModel.create as jest.Mock).mockResolvedValue({
            ...mockReservation,
            endDate: fourMonthsLater,
        });

        (MemberModel.findByPk as jest.Mock).mockResolvedValue(mockMember);
        (BookModel.findByPk as jest.Mock).mockResolvedValue(mockBook);


        await createBooking(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(jsonMock).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "Réservation créée avec succès",
                data: expect.objectContaining({
                    endDate: expect.any(Date)
                }),
            })
        );
    });
});
