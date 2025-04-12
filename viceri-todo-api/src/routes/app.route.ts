import { Router } from "express";
import { TodoRepository } from "../repositories/todo.repository.js";
import { TodoService } from "../services/todo.service.js";
import { TodoController } from "../controllers/todo.controller.js";
import { db } from "../database.js";
import { UserRepository } from "../repositories/user.repository.js";
import { UserService } from "../services/user.service.js";
import { UserController } from "../controllers/user.controller.js";
import { authenticateRoute } from "./middlewares/auth.middleware.js";


// SIMULANDO INJEÇÃO DE DEPENDENCIAS
const repository = new TodoRepository(db);
const service = new TodoService(repository);
const controller = new TodoController(service);

const userRepository = new UserRepository(db);
const userService = new UserService(userRepository);
const userController = new UserController(userService);

export class AppRouter {
    public static setup() {

        const router = Router();

        router.get('/todos', authenticateRoute, controller.getAll);
        router.post('/todos', authenticateRoute, controller.create);
        router.put('/todos/:id', authenticateRoute, controller.update);
        router.delete('/todos/:id', authenticateRoute, controller.delete);


        router.get('/users/info', authenticateRoute, userController.getById);
        router.post('/users', userController.create);

        router.post('/users/authenticate', userController.authenticate);
        
        return router;
    }
}