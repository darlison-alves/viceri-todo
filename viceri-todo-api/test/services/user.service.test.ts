import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserService } from "../../src/services/user.service";
import { UserDTO } from "../../src/dtos/user.dto";
import { UserAlreadyExistsError, CredentialsError } from "../../src/exceptions/business.error";
import { UserNotFoundError } from "../../src/exceptions/notfound.error";
import { JWT_SECRET } from "../../src/config";
import { UserRepository } from "../../src/repositories/user.repository";

jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("UserService", () => {
  const mockUserRepo = {
    findByEmail: jest.fn(),
    findById: jest.fn(),
    create: jest.fn()
    
  } as unknown as jest.Mocked<UserRepository>;

  const userService = new UserService(mockUserRepo);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createUser", () => {
    it("deve criar um usuário se o email não existir", async () => {
      const userDTO: UserDTO = { email: "teste@email.com", password: "senha123", name: "Teste" };
      mockUserRepo.findByEmail.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashedpassword");
      mockUserRepo.create.mockResolvedValue({lastID: 1});

      const result = await userService.createUser(userDTO);

      expect(bcrypt.hash).toHaveBeenCalledWith("senha123", 10);
      expect(mockUserRepo.create).toHaveBeenCalledWith({ email: "teste@email.com", password: "hashedpassword", name: "Teste" });
      expect(result).toEqual({  "lastID": 1 });
    });

    it("deve lançar erro se o usuário já existir", async () => {
      mockUserRepo.findByEmail.mockResolvedValue({ id: 1, email: "", name: "", password: "" });

      await expect(userService.createUser({ email: "teste@email.com", password: "123", name: "Teste" }))
        .rejects
        .toThrow(UserAlreadyExistsError);
    });
  });

  describe("existsUser", () => {
    it("deve lançar erro se email já existir", async () => {
      mockUserRepo.findByEmail.mockResolvedValue({ id: 1, email: "", name: "", password: "" });

      await expect(userService.existsUser("teste@email.com"))
        .rejects
        .toThrow(UserAlreadyExistsError);
    });

    it("deve passar se email não existir", async () => {
      mockUserRepo.findByEmail.mockResolvedValue(null);

      await expect(userService.existsUser("novo@email.com")).resolves.toBeUndefined();
    });
  });

  describe("getUserById", () => {
    it("deve retornar usuário se id existir", async () => {
      const user = { id: 1, email: "a@a.com", password: "hashed" };
      mockUserRepo.findById.mockResolvedValue(user);

      const result = await userService.getUserById(1);

      expect(result).toEqual(user);
    });

    it("deve lançar erro se usuário não for encontrado", async () => {
      mockUserRepo.findById.mockResolvedValue(null);

      await expect(userService.getUserById(999)).rejects.toThrow(UserNotFoundError);
    });
  });

  describe("authenticate", () => {
    it("deve retornar token se credenciais forem válidas", async () => {
      const user = { id: 1, email: "user@test.com", password: "hashed", name: "User" };
      mockUserRepo.findByEmail.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue("fake-jwt");

      const token = await userService.authenticate("user@test.com", "senha123");

      expect(token).toBe("fake-jwt");
      expect(jwt.sign).toHaveBeenCalledWith({ id: 1 }, JWT_SECRET, { expiresIn: "1h" });
    });

    it("deve lançar erro se usuário não for encontrado", async () => {
      mockUserRepo.findByEmail.mockResolvedValue(null);

      await expect(userService.authenticate("x@x.com", "senha")).rejects.toThrow(CredentialsError);
    });

    it("deve lançar erro se senha for inválida", async () => {
      const user = { id: 1, email: "user@test.com", password: "hashed", name: "User" };
      mockUserRepo.findByEmail.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(userService.authenticate("user@test.com", "senhaerrada")).rejects.toThrow(CredentialsError);
    });
  });
});
