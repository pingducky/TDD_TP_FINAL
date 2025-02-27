import { ErrorEnum } from "../enums/errorEnum";
import { BadRequestError } from "../errors/BadRequestError";
import { ConflictError } from "../errors/ConflictError";
import { ForbiddenError } from "../errors/ForbiddenError";
import { NotFoundError } from "../errors/NotFoundError";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { Response } from "express";

export const handleHttpError = (error: unknown, res: Response): void => {
    console.log("error ", error);
    if (error instanceof NotFoundError) {
        res.status(404).json({ error: error.message });
        return;
    }
    if (error instanceof UnauthorizedError) {
        res.status(401).json({ error: error.message });
        return;
    }
    if (error instanceof ForbiddenError) {
        res.status(403).json({ error: error.message });
        return;
    }
    if (error instanceof BadRequestError) {
        res.status(400).json({ error: error.message });
        return;
    }
    if (error instanceof ConflictError) {
        res.status(409).json({ error: error.message });
        return;
    }

    res.status(500).json({ error: ErrorEnum.UNEXPECTED_ERROR }); // Gestion des erreurs inconnues
};
