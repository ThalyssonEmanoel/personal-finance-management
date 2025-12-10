/**
 * @generateResetCode essa função serve para gerar um código de 6 dígitos aleatório.
 */
export function generateResetCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}