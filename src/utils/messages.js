export const messages = {

  httpCodes: {
    200: "Requisição bem sucedida.",
    201: "Requisição bem sucedida, recurso foi criado",
    204: "Requisição bem sucedida, sem conteúdo para retornar",

    400: "Requisição com sintaxe incorreta ou outros problemas.",
    401: "Cliente sem credenciais para acessar o recurso solicitado.",
    403: "Sem permissão para atender a requisição.",
    404: "O recurso solicitado não foi encontrado no servidor.",
    409: "A requisição do cliente em conflito com o estado atual do servidor.",
    498: "Acesso negado devido o token ser inválido.",
    500: "Servidor encontrou um erro interno.",
    501: "Funcionalidade não suportada.",
  },

  // Mensagens informativas
  // info: {
  //   welcome: "Bem-vindo à nossa aplicação!",
  //   userLoggedIn: (username) => `Usuário ${username} logado com sucesso.`,
  // },

  // success: {
  //   success: "Requisição bem-sucedida",
  // },

  error: {
    error: "Ocorreu um erro ao processar a solicitação.",
    serverError: "Erro interno do servidor. Tente novamente mais tarde.",
    invalidRequest: "Requisição inválida. Verifique os parâmetros fornecidos.",
    unauthorizedAccess: "Acesso não autorizado. Faça login para continuar.",
    invalidURL: "URL inválida. Verifique a URL fornecida.",
    unsupportedOperation: "Operação não suportada neste contexto.",
    dataParsingError: "Erro ao analisar os dados recebidos.",
    externalServiceError: "Erro ao se comunicar com um serviço externo.",
    internalServerError: "Erro ao se comunicar com um serviço interno.",
    invalidApiKey: "Chave de API inválida.",
    operationCanceled: "Operação cancelada pelo usuário.",
    resourceNotFound: (field) => `O campo ${field} não foi encontrado.`,
    resourceExists: (data) => `O(s) campo(s) ${data} já existe(m) no banco.`,
    resourceFound: (id) => `O campo ${id} já existe.`,
    pageIsNotAvailable: (page) => `A página ${page} não está disponível.`,
    pageNotContainsData: (page) => `A página ${page} não contém dados.`,
  },


  // categorias de erros para referencias e integridades
  validationReference: {
    resourceWithReference: (resource, reference) => {
      return { message: `${resource} com referência em ${reference}. Exclusão impedida.` };
    },

  },

  // Mensagens de validação personalizadas
  customValidation: {
    invalidTitulo: { message: "Título inválido. Verifique o formato e tente novamente." },
    invalidNome: { message: "Nome inválido. Verifique o formato e tente novamente." },
    invalidMatricula: { message: "Matrícula inválido. Verifique o formato e tente novamente." },

    lengthTooBig: (fieldName, length) => `O campo ${fieldName} deve ter no máximo ${length} de tamanho.`,
    lengthTooShort: (fieldName, length) => `O campo ${fieldName} deve ter no mínimo ${length} de tamanho.`,

    valueTooBig: (fieldName, value) => `O campo ${fieldName} deve ser no máximo ${value}.`,
    valueTooSmall: (fieldName, value) => `O campo ${fieldName} deve ser no mínimo ${value}.`
  },


  auth: {
    authenticationFailed: "Falha na autenticação. Credenciais inválidas.",

    userNotFound: (userId) => `Usuário com ID ${userId} não encontrado.`,

    invalidPermission: "Permissão insuficiente para executar a operação.",

    duplicateEntry: (fieldName) => `Já existe um registro com o mesmo ${fieldName}.`,

    accountLocked: "Conta bloqueada. Entre em contato com o suporte.",

    invalidToken: "Token inválido. Faça login novamente.",

    timeoutError: "Tempo de espera excedido. Tente novamente mais tarde.",

    databaseConnectionError: "Erro de conexão com o banco de dados. Tente novamente mais tarde.",

    emailAlreadyExists: (email) => `O endereço de e-mail ${email} já está em uso.`,

    invalidCredentials: "Credenciais inválidas. Verifique seu usuário e senha.",
  },
};

/**
* Envia uma resposta de erro com o código e a mensagem especificada
* de acordo com o padrão de envio de respostas da API
* 
* @example
* //Exemplos de diferentes formas aceitáveis de usar:
* sendError(res, 400, "Mensagem de erro")
* sendError(res, 400, [{message:"msg A"}, {message:"msg B"}])
* sendError(res, 400, {message:"Campo Obrigatório", field:"senha"})
*/
export const sendError = (res, code, errors = []) => {
  // Detecta diferentes formas de usar:
  let _errors = undefined;
  if (Array.isArray(errors)) {
    // Se for um array de erros --> sendError(res, 400, [{message:"A"},{message:"B"}])
    _errors = errors;
  } else if (typeof errors === "object" && errors.message !== undefined) {
    // Se for um objeto com a propriedade message --> sendError(res, 400, {message:"A"})
    _errors = [errors];
  } else {
    // Se for uma string ou qualquer outro tipo --> sendError(res, 400, "A")
    _errors = [{ message: "" + errors }];
  }
  return res.status(code).json({
    data: [],
    error: true,
    code: code,
    message: messages.httpCodes[code],
    errors: _errors,
  });
};

/**
* Envia uma resposta com o código e a mensagem especificada
* de acordo com o padrão de envio de respostas da API
* 
* @example
* sendResponse(res, 200, {
*    data: usuario
* });
*/
export const sendResponse = (res, code, resp = {}) => {
  return res.status(code).json({
    ...{
      error: false,
      code: code,
      message: messages.httpCodes[code],
      errors: [],
      data: []
    }, ...resp
  });
};

export default messages;
