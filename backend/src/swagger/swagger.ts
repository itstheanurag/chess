import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Chess Backend API',
    version: '1.0.0',
    description: 'API documentation for Chess Backend application',
  },
  servers: [
    {
      url: 'http://localhost:3000/',
      description: 'Local API server',
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
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.ts'],
};
const swaggerSpec = swaggerJSDoc(options);

const setupSwagger = (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
      persistAuthorization: true, 
    },
  }));
};

export { setupSwagger, swaggerSpec };
