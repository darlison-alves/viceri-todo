import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { UserDTO } from "../dtos/user.dto";
import { CredentialsError, UserAlreadyExistsError } from "../exceptions/business.error.js";
import { UserNotFoundError } from "../exceptions/notfound.error.js";
import { UserRepository } from "../repositories/user.repository";
import { JWT_SECRET } from "../config.js";

export class UserService {

    constructor(private userRepo: UserRepository) { }

    async createUser(userDTO: UserDTO) {

        await this.existsUser(userDTO.email);

        userDTO.password = await bcrypt.hash(userDTO.password, 10);

        return this.userRepo.create(userDTO);
    }

    async existsUser(email: string): Promise<void> {
        const user = await this.userRepo.findByEmail(email);
        
        if (user) {
            throw new UserAlreadyExistsError(email);
        }
    }

    async getUserById(id: number): Promise<Partial<UserDTO>> {
        const user = await this.userRepo.findById(id);

        if (!user) {
            throw new UserNotFoundError(id);
        }

        return user
    }

    async authenticate(email: string, password: string): Promise<string> {
        const user = await this.userRepo.findByEmail(email);

        if (!user) {
            throw new CredentialsError();
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            throw new CredentialsError();
        }

        return jwt.sign({ id: user.id }, JWT_SECRET, {
            expiresIn: "1h"
        });
    }

}