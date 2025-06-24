import UserRepository from "../repositories/UserRepository.js"
// import UsuarioSchema from "../schemas/usuarioSchema.js"
//TypeScript: Restart TS server

class UserService {

  static async listUsers(filtros, page, limit, order = 'asc') {
    // const validFiltros = UsuarioSchema.listarUsuarios.parse(filtros);// Usar quando o schema estiver pronto
    const skip = (page - 1) * limit;
    const take = parseInt(limit, 10);
    const [usuarios, total] = await Promise.all([
      UserRepository.listUsers(filtros, skip, take, order),
      UserRepository.contUsers()
    ]);
    if (!usuarios) {
      throw { code: 404 }
    }
    return { usuarios, total };
  }
}

export default UserService
