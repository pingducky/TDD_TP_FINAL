import { Request, Response } from "express";
import { getBookingById } from "../../../controllers/BookingController";
import ReservationModel from "../../../models/ReservationModel";

jest.mock("../../../models/ReservationModel");

describe("Récupération d'une réservation par ID", () => {
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

    test("Ne doit pas renvoyer de réservation si elle n'existe pas", async () => {
        req = { params: { id: "1" } };

        (ReservationModel.findOne as jest.Mock).mockResolvedValue(null);

        await getBookingById(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(jsonMock).toHaveBeenCalledWith({ error: "Réservation introuvable" });
    });

    test("Doit récupérer une réservation par ID avec succès", async () => {
        const mockBooking = { id: 1, bookId: 1, userId: 1 };
        req = { params: { id: "1" } };

        (ReservationModel.findOne as jest.Mock).mockResolvedValue(mockBooking);

        await getBookingById(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(jsonMock).toHaveBeenCalledWith(mockBooking);
    });
});
