import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';

import { AppRouter } from './routes/app.route.js';
import { BusinessError } from './exceptions/business.error.js';


const app = express();
app.use(cors());
app.use(express.json());

app.use(AppRouter.setup());

app.use((err: BusinessError, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).send({ message: err.message || 'Something broke!' });
});

app.listen(3000, () => {
  console.log('🚀 Server running on http://localhost:3000');
});
