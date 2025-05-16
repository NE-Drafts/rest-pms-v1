import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
// import routes from './routes';
// import { errorHandler } from './middleware/error.middleware';
import swaggerUi from 'swagger-ui-express';
// import swaggerSpec from '../docs/swagger';
import userRoutes from './modules/user/user.routes';

const app = express();

app.use(cors());
// app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/users', userRoutes);
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
    res.send('Welcome to the Parking API');
})

// app.use(errorHandler);

export default app;
