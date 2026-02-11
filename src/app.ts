import express, { Application, Request, Response } from 'express';
import { prisma } from './app/lib/prisma';
import { IndexRoutes } from './app/routes';

const app: Application = express();

// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());

// All routes
app.use('/api/v1', IndexRoutes);

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript + Express!');
});

// Basic route
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

export default app;
