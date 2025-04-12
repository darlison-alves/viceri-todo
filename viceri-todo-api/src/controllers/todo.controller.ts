import { Request, Response } from 'express';
import { TodoService } from '../services/todo.service';
import { AuthenticatedRequest } from '../routes/middlewares/auth.middleware';

export class TodoController {
    constructor(private todoService: TodoService) { }

    getAll = async (req: AuthenticatedRequest, res: Response) => {
        
        const userId = req.user!.id;
        
        const todos = await this.todoService.findAllByUserId(userId);
        res.json(todos);
    };

    create = async (req: AuthenticatedRequest, res: Response) => {
        const { title, priority } = req.body;

        const userId = req.user!.id;

        const result = await this.todoService.createTodo(userId, {
            title,
            priority
        });
        res.status(201).json(result);
    };

    update = async (req: Request, res: Response) => {
        const id = Number(req.params.id);
        const { done } = req.body;
        await this.todoService.updateTodo(id, done);
        res.send();
    };

    delete = async (req: Request, res: Response) => {
        const id = Number(req.params.id);
        await this.todoService.deleteTodo(id);
        res.send();
    };
}
