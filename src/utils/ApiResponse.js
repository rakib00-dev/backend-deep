class ApiResponse {
  constructor(message = "success", statusCode, data) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.success = success < 400;
  }
}

export { ApiResponse };
