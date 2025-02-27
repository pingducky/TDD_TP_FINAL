import { ErrorEnum } from "../enums/errorEnum";

export class ConflictError extends Error {
    status: number;
    constructor(message: string) {
        super(message);
        this.name = ErrorEnum.CONFLICT;
        this.status = 409;
    }
}