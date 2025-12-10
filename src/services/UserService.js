import UserRepository from "../repositories/UserRepository.js"
import UserSchema from "../schemas/UserSchemas.js"
import bcrypt from "bcryptjs";
import AccountService from "./AccountService.js";
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
      UserRepository.contUsers(dbFilters)
    ]);
    if (!usuarios) {
      throw { code: 404 }
    }
    return { usuarios, total, take };
  };

  static async getUserById(id) {
    const validId = UserSchema.userIdParam.parse({ id });
    const user = await UserRepository.getUserById(validId.id);

    if (!user) {
      throw { code: 404, message: "Usuário não encontrado" };
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
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

    //Deve criar uma conta para o usuário de forma automaica uma conta "carteira"
    await AccountService.createAccount({ name: "Carteira", type: "Carteira", balance: 0, icon: "uploads/carteira-icon.png", paymentMethodIds: [1], userId: newUser.id });
    return newUser;
  }

  static async updateUser(id, userData) {
    const validId = UserSchema.userIdParam.parse({ id });
    const validUserData = UserSchema.updateUser.parse(userData);

    // Filtrar campos vazios/nulos para não serem processados
    const filteredData = {};
    Object.keys(validUserData).forEach(key => {
      const value = validUserData[key];
      if (value !== undefined && value !== null && value !== "") {
        filteredData[key] = value;
      }
    });

    const updatedUser = await UserRepository.updateUser(validId.id, filteredData);

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

  static async changePassword(id, passwordData, requestingUserId) {
    const validId = UserSchema.userIdParam.parse({ id });
    const validPasswordData = UserSchema.changePassword.parse(passwordData);

    // Verificar se o usuário está tentando alterar a própria senha
    if (validId.id !== parseInt(requestingUserId)) {
      throw { code: 403, message: "Você só pode alterar sua própria senha." };
    }

    // Buscar o usuário para verificar a senha atual
    const user = await UserRepository.getUserById(validId.id);
    if (!user) {
      throw { code: 404, message: "Usuário não encontrado." };
    }

    // Verificar se a senha atual está correta
    const isCurrentPasswordValid = await bcrypt.compare(validPasswordData.currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw { code: 401, message: "Senha atual incorreta." };
    }

    // Criptografar a nova senha
    const saltRounds = parseInt(process.env.SALT) || 10;
    const hashedNewPassword = await bcrypt.hash(validPasswordData.newPassword, saltRounds);

    // Atualizar apenas a senha
    const updatedUser = await UserRepository.updateUser(validId.id, { password: hashedNewPassword });

    return { message: "Senha alterada com sucesso." };
  }
}

export default UserService
