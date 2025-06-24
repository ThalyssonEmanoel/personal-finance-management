import messages from "./messages.js";

class CommonResponse {
  constructor(error, code, message, data = []) {
    this.error = error;
    this.code = code;
    this.message = message;
    this.data = data;
  }

  static success(data, message = messages.httpCodes[200]) {
    return new CommonResponse(false, 200, message, data);
  }

  static created(data, message = messages.httpCodes[201]) {
    return new CommonResponse(false, 201, message, data);
  }

  static noContent(message = messages.httpCodes[204]) {
    return new CommonResponse(false, 204, message);
  }



  static badRequest(message = messages.error.invalidRequest) {
    return new CommonResponse(true, 400, message);
  }

  static unauthorized(message = messages.error.unauthorizedAccess) {
    return new CommonResponse(true, 401, message);
  }

  static forbidden(message = messages.error.invalidPermission) {
    return new CommonResponse(true, 403, message);
  }

  static notFound(message = messages.httpCodes[404]) {
    return new CommonResponse(true, 404, message);
  }

  static conflict(message = messages.httpCodes[409]) {
    return new CommonResponse(true, 409, message);
  }
  static invalidToken(message = messages.httpCodes[498]) {
    return new CommonResponse(true, 498, message);
  }

  static serverError(message = messages.error.serverError) {
    return new CommonResponse(true, 500, message);
  }

  static notImplemented(message = messages.httpCodes[501]) {
    return new CommonResponse(true, 501, message);
  }
}

export default CommonResponse;
