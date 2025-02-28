import { Request, Response } from 'express';
import { BadRequestError } from '../errors/BadRequestError';
import MemberModel from '../models/MemberModel';
import { NotFoundError } from '../errors/NotFoundError';
import BookModel from '../models/BookModel';
import ReservationModel from '../models/ReservationModel';
import { handleHttpError } from '../services/ErrorService';


export const createBooking = async (req: Request, res: Response): Promise<void> => {
    try {
        const { memberId, bookId } = req.body;

        // Vérification des champs requis
        if (!memberId || !bookId) {
            throw new BadRequestError('Champs requis manquants');
        }
        // Vérifier si l'adhérent existe
        const member = await MemberModel.findByPk(memberId);
        if (!member) {
            throw new NotFoundError('Le membre n\'existe pas');
        }
    
        // Vérifier si le livre existe
        const book = await BookModel.findByPk(bookId);
        if (!book) {
            throw new NotFoundError('Le livre n\'existe pas');
        }

        // Vérifier si l'adhérent n'a pas déjà 3 réservations actives
        const activeReservationsCount = await ReservationModel.count({
            where: { memberId },
        });

        if (activeReservationsCount >= 3) {
            throw new BadRequestError("Vous avez déjà 3 réservations en cours");
        }
    
        // Déterminer la date de fin (4 mois après la date de réservation)
        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setMonth(startDate.getMonth() + 4);
    
        // Créer la réservation
        const reservation = await ReservationModel.create({
            memberId,
            bookId,
            startDate,
            endDate,
        });
    
        res.status(201).json({
            message: "Réservation créée avec succès",
            data: reservation,
        });
    } catch(error) {
        handleHttpError(error, res);
    }
};

export const closeBookingById = async (req: Request, res: Response): Promise<void> => {

};

export const closeBookingByIsbn = async (req: Request, res: Response): Promise<void> => {

};