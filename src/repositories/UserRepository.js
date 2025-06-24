import { prisma } from "../config/prismaClient.js";

class UserRepository {

  static async listUsers(filtros, skip, take, order) {
    const where = {
      ...filtros,
    };
    return await prisma.users.findMany({
      where,
      skip: skip,
      take: take,
      orderBy: { idUsu: order },
      select: {
        idUsu: true,
        Nome: true,
        Email: true,
        Senha: true,
        Avatar: true
      },
    });
  }
  static async contUsers() {
    return await prisma.users.count();
  }
}

export default UserRepository;
