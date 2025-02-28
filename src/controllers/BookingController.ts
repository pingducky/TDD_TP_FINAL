import { Request, Response } from 'express';
import { BadRequestError } from '../errors/BadRequestError';
import MemberModel from '../models/MemberModel';
import { NotFoundError } from '../errors/NotFoundError';
import BookModel from '../models/BookModel';
import ReservationModel from '../models/ReservationModel';
import { handleHttpError } from '../services/ErrorService';
import { BookService } from '../services/BookService';


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
    try {
        const { reservationId } = req.params;

        if (!reservationId) {
            throw new BadRequestError('ID de réservation manquant');
        }

        const reservation = await ReservationModel.findByPk(reservationId);
        if (!reservation) {
            throw new NotFoundError("La réservation n'existe pas");
        }

        reservation.actualEndDate = new Date();
        await reservation.save();

        res.status(200).json({ message: "Réservation clôturée avec succès" });
    } catch (error) {
        handleHttpError(error, res);
    }
};

export const closeBookingByIsbn = async (req: Request, res: Response): Promise<void> => {
    try {
        const { isbn } = req.params;

        if (!isbn || !BookService.isIsbnValid(isbn)) {
            throw new BadRequestError('ISBN invalide');
        }

        const book = await BookModel.findOne({ where: { isbn } });
        if (!book) {
            throw new NotFoundError("Livre introuvable avec cet ISBN");
        }

        const reservation = await ReservationModel.findOne({ where: { bookId: book.id } });
        if (!reservation) {
            throw new NotFoundError("Aucune réservation trouvée pour ce livre");
        }

        reservation.actualEndDate = new Date();
        await reservation.save();

        res.status(200).json({ message: "Réservation clôturée avec succès" });
    } catch (error) {
        handleHttpError(error, res);
    }
};

export const getAllBooking = async (req: Request, res: Response): Promise<void> => {
    try {
        const bookings = await ReservationModel.findAll();
        if (bookings.length === 0) {
            throw new NotFoundError("Aucune réservation trouvée");
        }
        res.status(200).json(bookings);
    } catch (error) {
        handleHttpError(error, res);
    }
};

export const getBookingById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const booking = await ReservationModel.findOne({ where: { id } });

        if (!booking) {
            throw new NotFoundError("Réservation introuvable");
        }

        res.status(200).json(booking);
    } catch (error) {
        handleHttpError(error, res);
    }
};

export const getBookingByIsbn = async (req: Request, res: Response): Promise<void> => {
    try {
        const { isbn } = req.params;

        if (!isbn || !BookService.isIsbnValid(isbn)) {
            throw new BadRequestError('ISBN invalide');
        }

        const book = await BookModel.findOne({ where: { isbn } });
        if (!book) {
            throw new NotFoundError("Livre introuvable avec cet ISBN");
        }

        const reservation = await ReservationModel.findOne({ where: { bookId: book.id } });
        if (!reservation) {
            throw new NotFoundError("Aucune réservation trouvée pour ce livre");
        }

        res.status(200).json(reservation);
    } catch (error) {
        handleHttpError(error, res);
    }
};

export const getOpenedBooking = async (req: Request, res: Response): Promise<void> => {
    try {
        const reservations = await ReservationModel.findAll({
            where: { actualEndDate: null }, 
        });

        res.status(200).json(reservations);
    } catch (error) {
        handleHttpError(error, res);
    }
};
