import { AppError } from "./app-error";

export class ForbidenError extends AppError {
    constructor(message = "Forbidden") {
        super(message, 403);
    }
}