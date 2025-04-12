export class BusinessError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.name = "BusinessError";
    this.statusCode = statusCode;
  }
}

export class UserAlreadyExistsError extends BusinessError {
  constructor(email: string) {
    super(`usuário com email ${email} já existe!`, 409);
    this.name = "UserAlreadyExistsError";
  }
}


export class CredentialsError extends BusinessError {
  constructor() {
    super("usuário ou senha invalida", 401);
    this.name = "CredentialsError";
  }
}

