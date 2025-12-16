type TErrorSource = {
  field: string;
  message: string;
};

class AppError extends Error {
  public statusCode: number;
  public errors: TErrorSource[] | null;

  constructor(
    statusCode: number,
    message: string,
    errors: TErrorSource[] | null = null,
    stack?: string,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default AppError;