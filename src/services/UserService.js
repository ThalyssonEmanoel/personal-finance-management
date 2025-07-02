import UserRepository from "../repositories/UserRepository.js"
// import UsuarioSchema from "../schemas/usuarioSchema.js"
import bcrypt from "bcryptjs";
//TypeScript: Restart TS server

class UserService {

  static async listUsers(filtros, page, limit, order = 'asc') {
    // const validFiltros = UsuarioSchema.listUser.parse(filtros);// Usar quando o schema estiver pronto
    if (filtros.id) {
      filtros.id = parseInt(filtros.id, 10);
    }
    const skip = (page - 1) * limit;
    const take = parseInt(limit, 10);
    const [usuarios, total] = await Promise.all([
      UserRepository.listUsers(filtros, skip, take, order),
      UserRepository.contUsers()
    ]);
    if (!usuarios) {
      throw { code: 404 }
    }
    return { usuarios, total, take };
  };
  static async createUser(user) {
    // const validUser = UsuarioSchema.createUser.parse(user); // Usar quando o schema estiver pronto
    
    // Criptografar a senha antes de salvar
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(user.Senha, saltRounds);
    
    const userWithHashedPassword = {
      ...user,
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
