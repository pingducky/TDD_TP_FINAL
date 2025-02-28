import { Request, Response } from "express";
import { getBookingByIsbn } from "../../../controllers/BookingController";
import ReservationModel from "../../../models/ReservationModel";
import BookModel from "../../../models/BookModel";
import { BookService } from "../../../services/BookService";

jest.mock("../../../models/ReservationModel");
jest.mock("../../../models/BookModel");
jest.mock("../../../services/BookService");

describe("Récupération d'une réservation par ISBN", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let jsonMock: jest.Mock;

    beforeEach(() => {
        jest.resetAllMocks();
        req = {};
        jsonMock = jest.fn();
        res = {
            status: jest.fn(() => res),
            json: jsonMock,
        } as Partial<Response>;
    });

    test("Ne doit pas récupérer une réservation si l'ISBN est invalide", async () => {
        req = { params: { isbn: "invalid_isbn" } };

        (BookService.isIsbnValid as jest.Mock).mockReturnValue(false);

        await getBookingByIsbn(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(jsonMock).toHaveBeenCalledWith({ error: "ISBN invalide" });
    });

    test("Ne doit pas récupérer de réservation si aucun livre n'est trouvé", async () => {
        req = { params: { isbn: "123456789" } };

        (BookService.isIsbnValid as jest.Mock).mockReturnValue(true);
        (BookModel.findOne as jest.Mock).mockResolvedValue(null);

        await getBookingByIsbn(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(jsonMock).toHaveBeenCalledWith({ error: "Livre introuvable avec cet ISBN" });
    });

    test("Ne doit pas récupérer de réservation si aucune réservation n'est trouvée pour le livre", async () => {
        const mockBook = { id: 1 };
        req = { params: { isbn: "123456789" } };

        (BookService.isIsbnValid as jest.Mock).mockReturnValue(true);
        (BookModel.findOne as jest.Mock).mockResolvedValue(mockBook);
        (ReservationModel.findOne as jest.Mock).mockResolvedValue(null);

        await getBookingByIsbn(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(jsonMock).toHaveBeenCalledWith({ error: "Aucune réservation trouvée pour ce livre" });
    });

    test("Doit récupérer une réservation avec succès par ISBN", async () => {
        const mockBook = { id: 1 };
        const mockReservation = { id: 1, bookId: 1, userId: 1 };
        req = { params: { isbn: "123456789" } };

        (BookService.isIsbnValid as jest.Mock).mockReturnValue(true);
        (BookModel.findOne as jest.Mock).mockResolvedValue(mockBook);
        (ReservationModel.findOne as jest.Mock).mockResolvedValue(mockReservation);

        await getBookingByIsbn(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(jsonMock).toHaveBeenCalledWith(mockReservation);
    });
});
