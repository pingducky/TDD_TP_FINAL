import { Request, Response } from "express";
import { getOpenedBooking } from "../../../controllers/BookingController";
import ReservationModel from "../../../models/ReservationModel";

jest.mock("../../../models/ReservationModel");

describe("Récupération des réservations ouvertes", () => {
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

    test("Doit retourner une liste de réservations ouvertes", async () => {
        const mockReservations = [
            { id: 1, bookId: 101, actualEndDate: null },
            { id: 2, bookId: 202, actualEndDate: null },
        ];

        (ReservationModel.findAll as jest.Mock).mockResolvedValue(mockReservations);

        await getOpenedBooking(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(jsonMock).toHaveBeenCalledWith(mockReservations);
    });

    test("Doit retourner une liste vide si aucune réservation n'est ouverte", async () => {
        (ReservationModel.findAll as jest.Mock).mockResolvedValue([]);

        await getOpenedBooking(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(jsonMock).toHaveBeenCalledWith([]);
    });

    test("Doit gérer une erreur serveur correctement", async () => {
        (ReservationModel.findAll as jest.Mock).mockRejectedValue(new Error("Erreur serveur"));

        await getOpenedBooking(req as Request, res as Response);

        expect(res.status).not.toHaveBeenCalledWith(200);
        expect(res.status).toHaveBeenCalled();
    });
});
