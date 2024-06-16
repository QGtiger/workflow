import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

@Catch()
export class CommonFilter<T extends { message: string }>
  implements ExceptionFilter
{
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const errorResponse = {
      success: false,
      message: exception.message,
    };

    response.status(200).json(errorResponse);
  }
}
