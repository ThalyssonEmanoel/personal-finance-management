// importando o prisma client
import { PrismaClient } from "../generated/prisma/index.js";

// iniciando o prisma client
const prisma = new PrismaClient();

export { prisma };