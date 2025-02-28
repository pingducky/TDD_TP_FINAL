import { Request, Response } from "express";
import MemberModel from "../../../models/MemberModel";
import ReservationModel from "../../../models/ReservationModel";
import { getReservationByMemberId } from "../../../controllers/BookingController";

jest.mock("../../../models/MemberModel");
jest.mock("../../../models/ReservationModel");

describe("getReservationByMemberId", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let jsonMock: jest.Mock;

    const mockMember = { id: 1, name: "John Doe" };
    const mockReservations = [
        { id: 1, memberId: 1, bookId: 10, startDate: "2024-02-01", endDate: "2024-06-01" },
        { id: 2, memberId: 1, bookId: 15, startDate: "2024-02-05", endDate: "2024-06-05" }
    ];

    beforeEach(() => {
        req = { params: { memberId: "1" } };
        jsonMock = jest.fn();
        res = {
            status: jest.fn(() => res),
            json: jsonMock,
        } as Partial<Response>;
    });

    test("Retourne 404 si l'adhérent n'existe pas", async () => {
        (MemberModel.findByPk as jest.Mock).mockResolvedValue(null);

        await getReservationByMemberId(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(jsonMock).toHaveBeenCalledWith({ error: "Adhérent non trouvé" });
    });

    test("Retourne un tableau vide si l'adhérent n'a pas de réservations", async () => {
        (MemberModel.findByPk as jest.Mock).mockResolvedValue(mockMember);
        (ReservationModel.findAll as jest.Mock).mockResolvedValue([]);

        await getReservationByMemberId(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(jsonMock).toHaveBeenCalledWith({ reservations: [] });
    });

    test("Retourne la liste des réservations si l'adhérent en a", async () => {
        (MemberModel.findByPk as jest.Mock).mockResolvedValue(mockMember);
        (ReservationModel.findAll as jest.Mock).mockResolvedValue(mockReservations);

        await getReservationByMemberId(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(jsonMock).toHaveBeenCalledWith({ reservations: mockReservations });
    });
});
