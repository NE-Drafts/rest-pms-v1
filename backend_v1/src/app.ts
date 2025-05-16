import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
// import routes from './routes';
// import { errorHandler } from './middleware/error.middleware';

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use('/api', routes);

// app.use(errorHandler);

export default app;
