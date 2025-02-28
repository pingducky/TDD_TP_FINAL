import { Request, Response } from "express";
import { closeBookingByIsbn } from "../../../controllers/BookingController";
import ReservationModel from "../../../models/ReservationModel";
import BookModel from "../../../models/BookModel";
import { BookService } from "../../../services/BookService";

jest.mock("../../../models/ReservationModel");
jest.mock("../../../models/BookModel");
jest.mock("../../../services/BookService");

describe("Clôture d'une réservation par ISBN", () => {
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

    test("Ne doit pas clôturer une réservation si l'ISBN est invalide", async () => {
        req = { params: { isbn: "invalid_isbn" } };

        (BookService.isIsbnValid as jest.Mock).mockReturnValue(false);

        await closeBookingByIsbn(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(jsonMock).toHaveBeenCalledWith({ error: "ISBN invalide" });
    });

    test("Ne doit pas clôturer une réservation si aucun livre n'est trouvé", async () => {
        req = { params: { isbn: "123456789" } };

        (BookService.isIsbnValid as jest.Mock).mockReturnValue(true);
        (BookModel.findOne as jest.Mock).mockResolvedValue(null);

        await closeBookingByIsbn(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(jsonMock).toHaveBeenCalledWith({ error: "Livre introuvable avec cet ISBN" });
    });

    test("Clôture d'une réservation avec succès par ISBN", async () => {
        const mockBook = { id: 1 };
        const mockReservation = { destroy: jest.fn() };
        req = { params: { isbn: "123456789" } };

        (BookService.isIsbnValid as jest.Mock).mockReturnValue(true);
        (BookModel.findOne as jest.Mock).mockResolvedValue(mockBook);
        (ReservationModel.findOne as jest.Mock).mockResolvedValue(mockReservation);

        await closeBookingByIsbn(req as Request, res as Response);

        expect(mockReservation.destroy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(jsonMock).toHaveBeenCalledWith({ message: "Réservation clôturée avec succès" });
    });
});
