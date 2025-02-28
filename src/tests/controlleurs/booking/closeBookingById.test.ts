import { Request, Response } from "express";
import { closeBookingById } from "../../../controllers/BookingController";
import ReservationModel from "../../../models/ReservationModel";

jest.mock("../../../models/ReservationModel");

describe("Clôture d'une réservation par ID", () => {
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

    test("Ne doit pas clôturer une réservation si l'ID est manquant", async () => {
        req = { params: {} };

        await closeBookingById(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(jsonMock).toHaveBeenCalledWith({ error: "ID de réservation manquant" });
    });

    test("Ne doit pas clôturer une réservation si elle n'existe pas", async () => {
        req = { params: { reservationId: "999" } };

        (ReservationModel.findByPk as jest.Mock).mockResolvedValue(null);

        await closeBookingById(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(jsonMock).toHaveBeenCalledWith({ error: "La réservation n'existe pas" });
    });

    test("Clôture d'une réservation avec succès", async () => {
        const mockReservation = { save: jest.fn(), actualEndDate: null };
        req = { params: { reservationId: "1" } };

        (ReservationModel.findByPk as jest.Mock).mockResolvedValue(mockReservation);

        await closeBookingById(req as Request, res as Response);

        expect(mockReservation.actualEndDate).toBeInstanceOf(Date);
        expect(mockReservation.save).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(jsonMock).toHaveBeenCalledWith({ message: "Réservation clôturée avec succès" });
    });
});
