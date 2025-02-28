import { Request, Response } from 'express';
import { handleHttpError } from '../services/ErrorService';
import MemberModel from '../models/MemberModel';
import { NotFoundError } from '../errors/NotFoundError';
import { BadRequestError } from '../errors/BadRequestError';
import { ConflictError } from '../errors/ConflictError';

export const getAllMember = async (res: Response): Promise<void> => {
  try {
    const members = await MemberModel.findAll();
    res.status(200).json(members);
  } catch (error) {
    handleHttpError(error, res);
  }
};

export const getMemberById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params; 

    if (!id) {
      throw new BadRequestError("Le champs id est manquant");
    }

    const member = await MemberModel.findByPk(id);
    if (!member) {
      throw new NotFoundError("Membre non trouvé");
    }
    res.status(200).json(member);
  } catch (error) {
    handleHttpError(error, res);
  }
};

export const createMember = async (req: Request, res: Response): Promise<void> => {
  try {
    const { lastName, firstName, email } = req.body;

    const missingFields = [];
    if (!lastName) missingFields.push("lastName");
    if (!firstName) missingFields.push("firstName");
    if (!email) missingFields.push("email");

    if (missingFields.length > 0) {
      throw new BadRequestError(`Champs requis manquants: ${missingFields.join(", ")}`);
    }

    const existingMember = await MemberModel.findOne({ where: { email } });
    if (existingMember) {
      throw new ConflictError("Un membre avec cet email existe déjà");
    }

    const newMember = await MemberModel.create({
      lastName,
      firstName,
      email,
    });

    res.status(201).json({
      message: "Membre créé avec succès",
      data: newMember,
    });
  } catch (error) {
    handleHttpError(error, res);
  }
};


export const deleteMemberById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new NotFoundError("Le membre avec cet ID n'a pas été trouvé");
    }

    const member = await MemberModel.findByPk(id);

    if (!member) {
      throw new NotFoundError("Membre non trouvé");
    }

    await member.destroy();

    res.status(200).json({ message: "Membre supprimé avec succès" });
  } catch (error) {
    handleHttpError(error, res);
  }
};