import express, { Application, Request, Response } from 'express';
import { prisma } from './app/lib/prisma';
import { IndexRoutes } from './app/routes';
import { globalErrorHandler } from './app/middleware/globalErrorHandler';
import { notFound } from './app/middleware/notFound';
import cookieParser from 'cookie-parser';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './app/lib/auth';
import path from 'path';
import cors from 'cors';
import { envVars } from './app/config/env';
import qs from 'qs';

const app: Application = express();
app.set('query parser', (str: string) => qs.parse(str));

app.set('view engine', 'ejs'); // Set EJS as the view engine
app.set('views', path.resolve(process.cwd(), `src/app/templates/`)); // Set the views directory

// Enable CORS for all routes (you can customize this as needed)
app.use(
  cors({
    origin: [
      envVars.FRONTEND_URL,
      envVars.BETTER_AUTH_URL,
      'http://localhost:3000',
      'http://localhost:5000',
    ],
    credentials: true, // Allow cookies to be sent in cross-origin requests
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  }),
);

app.use('/api/auth', toNodeHandler(auth));

app.set('view engine', 'ejs'); // Set EJS as the view engine
app.set('views', path.resolve(process.cwd(), `src/app/templates/`)); // Set the views directory

// Enable CORS for all routes (you can customize this as needed)
app.use(
  cors({
    origin: [
      envVars.FRONTEND_URL,
      envVars.BETTER_AUTH_URL,
      'http://localhost:3000',
      'http://localhost:5000',
    ],
    credentials: true, // Allow cookies to be sent in cross-origin requests
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  }),
);

app.use('/api/auth', toNodeHandler(auth));

// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());
// Middleware to parse cookies
app.use(cookieParser());

// All routes
app.use('/api/v1', IndexRoutes);

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript + Express!');
});

// Test DB
app.get('/db-test', async (req: Request, res: Response) => {
  const specialty = await prisma.specialty.create({
    data: {
      title: 'Cardiology',
    },
  });
  res.status(201).json({
    success: true,
    message: 'API is working',
    data: specialty,
  });
});

// Global Error Handler
app.use(globalErrorHandler);
// Not Found Route
app.use(notFound);

export default app;
