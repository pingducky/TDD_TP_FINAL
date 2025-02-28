import { Request, Response } from "express";
import { getAllBooking } from "../../../controllers/BookingController";
import ReservationModel from "../../../models/ReservationModel";

jest.mock("../../../models/ReservationModel");

describe("Récupération de toutes les réservations", () => {
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

    test("Ne doit pas renvoyer de réservations si aucune n'existe", async () => {
        (ReservationModel.findAll as jest.Mock).mockResolvedValue([]);

        await getAllBooking(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(jsonMock).toHaveBeenCalledWith({ error: "Aucune réservation trouvée" });
    });

    test("Doit récupérer toutes les réservations avec succès", async () => {
        const mockBookings = [{ id: 1, bookId: 1, userId: 1 }];
        (ReservationModel.findAll as jest.Mock).mockResolvedValue(mockBookings);

        await getAllBooking(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(jsonMock).toHaveBeenCalledWith(mockBookings);
    });
});
