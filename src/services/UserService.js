import UserRepository from "../repositories/UserRepository.js"
import UserSchema from "../schemas/UserSchemas.js"
import bcrypt from "bcryptjs";
//TypeScript: Restart TS server

class UserService {

  static async listUsers(filtros, page, limit, order = 'asc') {
    const validFiltros = UserSchema.listUser.parse(filtros);

    // Separate pagination parameters from database filters
    const { page: validPage, limit: validLimit, ...dbFilters } = validFiltros;

    if (dbFilters.id) {
      dbFilters.id = parseInt(dbFilters.id);
    }

    const skip = (page - 1) * limit;
    const take = parseInt(limit, 10);
    const [usuarios, total] = await Promise.all([
      UserRepository.listUsers(dbFilters, skip, take, order),
      UserRepository.contUsers()
    ]);
    if (!usuarios) {
      throw { code: 404 }
    }
    return { usuarios, total, take };
  };
  static async createUser(user) {
    const validUser = UserSchema.createUser.parse(user);

    const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;
    const hashedPassword = await bcrypt.hash(validUser.Senha, saltRounds);

    const userWithHashedPassword = {
      ...validUser,
      Senha: hashedPassword
    };

    const newUser = await UserRepository.createUser(userWithHashedPassword);
    if (!newUser) {
      throw { code: 404 }
    }
    return newUser;
  }
}

export default UserService
