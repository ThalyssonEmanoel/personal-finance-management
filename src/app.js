import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import path from "path";
import { fileURLToPath } from "url";
import { CronJob } from "cron";
import TransactionService from "./services/TransactionService.js";
import BalanceHistoryService from "./services/BalanceHistoryService.js";


//Tudo que está comentado abaixo é para servir arquivos estáticos, como imagens, do diretório 'uploads'.
const app = express();

/**
 * Implementar o cron job para fazer a cobrança recorrente https://youtu.be/4qZd5nhajmg?si=clMi9a0wRCvQiKTy
 * Para testar se está funcionando eu posso definir como "0 1 * * *"
 * 
 * Cron job que executa todos os dias às 01:00 para processar transações recorrentes
 * Formato: "segundo minuto hora dia mês dia-da-semana"
 * "0 1 * * *" = Todo dia às 01:00
 * "" * /25 * * * * *" = A cada 25 segundos (para testes)
 * ("0 1 * * *", async () => {
 * Cron job para registrar saldos diários das contas
 * Executa todos os dias às 23:59 (final do dia)
 * Formato: "segundo minuto hora dia mês dia-da-semana"
 * "0 59 23 * * *" = Todo dia às 23:59
 */
const balanceJob = new CronJob("0 59 23 * * *", async () => {
  try {
    console.log('CRON-JOB...');
    await TransactionService.processRecurringTransactions();
    await TransactionService.processInstallmentsTransactions();
    await BalanceHistoryService.recordAllAccountsDailyBalance();
    console.log('Cron-job finalizado.');
  } catch (error) {
    console.error('Erro no cron-job:', error);
  }
});
balanceJob.start();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

routes(app);

export default app;