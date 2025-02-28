import { Request, Response } from "express";
import { notifyUserOfExpiredBooking } from "../../../controllers/BookingController";
import MemberModel from "../../../models/MemberModel";
import ReservationModel from "../../../models/ReservationModel";

// /!\ Le stub est dupliqué car je n'ai pas réussis à le mettre dans un fichier séparé (bug lors de l'importation) /!\ 
// Todo : déplacer le stub dans src/services/mailer/mailerServiceStub

class MailerServiceStub implements IMailerService {
    private sendMailParam: { to: string; subject: string; body: string } | null = null;
    private sendMailData: boolean = false;

    async sendMail(to: string, subject: string, body: string): Promise<boolean> {
        this.sendMailParam = { to, subject, body };
        console.log(`Envoi du mail à ${to} avec le sujet: ${subject}`);
        console.log(`Corps du message: ${body}`);
        return Promise.resolve(this.getSendMailData);
    }

    public get getSendMailParam(): { to: string; subject: string; body: string } | null {
        return this.sendMailParam;
    }

    public get getSendMailData(): boolean {
        return this.sendMailData;
    }

    public set setSendMailData(data: boolean) {
        this.sendMailData = data;
    }
}

jest.mock("../../../models/MemberModel");
jest.mock("../../../models/ReservationModel");

describe("Notification des réservations expirées", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let mailerService: MailerServiceStub;
    let jsonMock: jest.Mock;

    beforeEach(() => {
        jest.resetAllMocks();
        req = {};
        jsonMock = jest.fn();
        res = {
            status: jest.fn(() => res),
            json: jsonMock,
        } as Partial<Response>;
        mailerService = new MailerServiceStub();
    });

    test("Ne doit pas envoyer de mail si l'id de l'adhérent est manquant", async () => {
        req = { params: {} };

        await notifyUserOfExpiredBooking(req as Request, res as Response, mailerService);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(jsonMock).toHaveBeenCalledWith({ error: "Id de l'adhérent manquant" });
    });

    test("Ne doit pas envoyer de mail si l'adhérent n'est pas trouvé", async () => {
        req = { params: { memberId: "1" } };

        (MemberModel.findByPk as jest.Mock).mockResolvedValue(null);

        await notifyUserOfExpiredBooking(req as Request, res as Response, mailerService);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(jsonMock).toHaveBeenCalledWith({ error: "Adhérent non trouvé" });
    });

    test("Ne doit pas envoyer de mail si aucune réservation expirée n'est trouvée", async () => {
        const mockMember = { id: 1, email: "test@example.com" };
        req = { params: { memberId: "1" } };

        (MemberModel.findByPk as jest.Mock).mockResolvedValue(mockMember);
        (ReservationModel.findAll as jest.Mock).mockResolvedValue([]);

        await notifyUserOfExpiredBooking(req as Request, res as Response, mailerService);

        expect(mailerService.getSendMailParam).toBeNull();
        expect(res.status).toHaveBeenCalledWith(204);
    });

    test("Doit envoyer un mail pour les réservations expirées", async () => {
        const mockMember = { id: 1, email: "test@example.com" };
        const mockReservation = {
            id: 1,
            memberId: 1,
            expectedEndDate: new Date("2025-02-01"),
        };
        req = { params: { memberId: "1" } };

        (MemberModel.findByPk as jest.Mock).mockResolvedValue(mockMember);
        (ReservationModel.findAll as jest.Mock).mockResolvedValue([mockReservation]);
        
        mailerService.setSendMailData = true;

        await notifyUserOfExpiredBooking(req as Request, res as Response, mailerService);

        expect(mailerService.getSendMailParam).toEqual({
            to: "test@example.com",
            subject: "Réservations expirées",
            body: "Les réservations suivantes ont expiré :\n\n- Réservation n°1 (Date de fin prévue : " + new Date("2025-02-01T00:00:00Z").toString() +")\n",
        });
        expect(res.status).toHaveBeenCalledWith(200);
    });
});
