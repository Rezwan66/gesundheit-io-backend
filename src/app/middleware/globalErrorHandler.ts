import { NextFunction, Request, Response } from 'express';
import { envVars } from '../config/env';
import status from 'http-status';
import z from 'zod';
import { TErrorResponse, TErrorSources } from '../interfaces/error.interface';
import { handleZodError } from '../errorHelpers/handleZodError';
import AppError from '../errorHelpers/AppError';
import { deleteFileFromCloudinary } from '../config/cloudinary.config';

export const globalErrorHandler = async (

export const globalErrorHandler = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  //# only see console.log in dev mode
  if (envVars.NODE_ENV === 'development') {
    console.log('Error from Global Error Handler', err);
  }

  //# if there is a file in the request, delete it from cloudinary
  if (req.file) {
    await deleteFileFromCloudinary(req.file.path);
  }
  if (req.files && Array.isArray(req.files) && req.files.length > 0) {
    const imageUrls = req.files.map(file => file.path);
    await Promise.all(imageUrls.map(url => deleteFileFromCloudinary(url)));
  }

  //# dynamic error code and message handling
  let errorSources: TErrorSources[] = [];
  let statusCode: number = status.INTERNAL_SERVER_ERROR;
  let message: string = 'Internal Server Error';
  let stack: string | undefined = undefined;

  //@ Zod error pattern
  //*
  // [
  //   {
  //     expected: 'string',
  //     code: 'invalid_type',
  //     path: [ 'username' ],
  //     message: 'Invalid input: expected string, received number'
  //   },
  //   {
  //     expected: 'number',
  //     code: 'invalid_type',
  //     path: [ 'favoriteNumbers', 1 ],
  //     message: 'Invalid input: expected number, received string'
  //   },
  //   {
  //     code: 'unrecognized_keys',
  //     keys: [ 'extraKey' ],
  //     path: [],
  //     message: 'Unrecognized key: "extraKey"'
  //   }
  // ];/

  if (err instanceof z.ZodError) {
    // statusCode = status.BAD_REQUEST;
    // message = 'Zod Validation Error';

    // err.issues.forEach(issue => {
    //   errorSources.push({
    //     path: issue.path.join(' => '),
    //     message: issue.message,
    //   });
    // });

    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode as number;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    stack = err.stack;
    errorSources = [
      {
        path: '',
        message: err.message,
      },
    ];
  } else if (err instanceof Error) {
    statusCode = status.INTERNAL_SERVER_ERROR;
    message = err.message;
    stack = err.stack;
    errorSources = [
      {
        path: '',
        message: err.message,
      },
    ];
  }

  const errorResponse: TErrorResponse = {
    success: false,
    message: message,
    errorSources,
    stack: envVars.NODE_ENV === 'development' ? stack : undefined,
    error: envVars.NODE_ENV === 'development' ? err.message : undefined,
  };

  res.status(statusCode).json(errorResponse);
};
