import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Smart Parking API',
      version: '1.0.0',
      description: 'A RESTful API for parking management',
      contact: {
        name: 'API Support',
        email: 'support@smartparking.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:5050',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: [
      {
        name: 'Auth',
        description: 'User authentication endpoints',
      },
      {
        name: 'Users',
        description: 'User management endpoints',
      },
      {
        name: 'Vehicles',
        description: 'Vehicle management endpoints',
      },
      {
        name: 'Parking Slots',
        description: 'Parking slot management endpoints',
      },
      {
        name: 'Reservations',
        description: 'Reservation management endpoints',
      },
    ],
  },
  apis: ['./src/modules/**/*.routes.ts', './src/modules/**/*.controller.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
