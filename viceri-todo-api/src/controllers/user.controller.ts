import { Request, Response } from "express";
import { UserDTO } from "../dtos/user.dto";
import { UserService } from "../services/user.service";
import { AuthenticatedRequest } from "../routes/middlewares/auth.middleware";

export class UserController {
    constructor(private userService: UserService) { }

    create = async (req: Request, res: Response) => {

        const { name, email, password } = req.body as UserDTO;

        const result = await this.userService.createUser({
            name,
            email,
            password
        });
        res.status(201).json(result);

    };

    getById = async (req: AuthenticatedRequest, res: Response) => {
        
        const { id } = req.user!;

        const user = await this.userService.getUserById(Number(id));

        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        res.status(200).json(user);
    }

    authenticate = async (req: Request, res: Response) => {
        const { email, password } = req.body;

        const token = await this.userService.authenticate(email, password);

        res.status(200).json({ token });
    }

}
