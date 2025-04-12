import { BusinessError } from "./business.error.js";

export class NotFoundError extends BusinessError {
    
    constructor(message: string) {
        super(message, 404);
        this.name = "NotFoundError";
    }
}
export class UserNotFoundError extends NotFoundError {
    constructor(userId: number) {
        super(`User with ID ${userId} not found`);
    }
}
export class TodoNotFoundError extends NotFoundError {
    constructor(todoId: number) {
        super(`Todo with ID ${todoId} not found`);
    }
}