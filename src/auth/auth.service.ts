import { HttpError } from "../error";
import { context } from "../context";

type JWT = (typeof context)["decorator"]["jwt"];

const WrongCredentialsError = new HttpError(400, "Неверные данные");

export class AuthService {
  constructor(private readonly jwt: JWT) {}

  private users = [
    {
      id: 1,
      username: "Kira",
      password: "12345678",
    },
    {
      id: 2,
      username: "Hannah",
      password: "2",
    },
    {
      id: 3,
      username: "Olivia",
      password: "3",
    },
  ];

  async login(username: string, password: string) {
    const user = this.users.find(
      (user) => user.username === username && user.password === password,
    );
    if (!user) throw WrongCredentialsError;

    const token = await this.jwt.sign({
      sub: user.id.toString(),
    });
    return { token };
  }
}
