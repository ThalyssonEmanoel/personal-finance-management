import UserRepository from "../repositories/UserRepository.js"
import UserSchema from "../schemas/UserSchemas.js"
import bcrypt from "bcryptjs";
//TypeScript: Restart TS server

class UserService {

  static async listUsers(filtros, page, limit, order = 'asc') {
    const validFiltros = UserSchema.listUser.parse(filtros);
    
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

    const saltRounds = parseInt(process.env.SALT) || 10;
    const hashedPassword = await bcrypt.hash(validUser.password, saltRounds);

    const userWithHashedPassword = {
      ...validUser,
      password: hashedPassword
    };

    const newUser = await UserRepository.createUser(userWithHashedPassword);
    if (!newUser) {
      throw { code: 404 }
    }
    return newUser;
  }

  static async updateUser(id, userData) {
    const validId = UserSchema.userIdParam.parse({ id });
    const validUserData = UserSchema.updateUser.parse(userData);

    if (validUserData.password) {
      const saltRounds = parseInt(process.env.SALT) || 10;
      validUserData.password = await bcrypt.hash(validUserData.password, saltRounds);
    }

    const updatedUser = await UserRepository.updateUser(validId.id, validUserData);

    if (!updatedUser) {
      throw { code: 404 };
    }

    return updatedUser;
  }

  static async deleteUser(id) {
    const validId = UserSchema.userIdParam.parse({ id });
    const result = await UserRepository.deleteUser(validId.id);

    return result;
  }
}

export default UserService
