// Configurar variables de entorno para tests E2E
process.env.NODE_ENV = 'e2e';
process.env.DB_HOST = 'localhost';
process.env.DB_PORT = '5434'; // Puerto del docker-compose.test.yml
process.env.DB_USERNAME = 'postgres';
process.env.DB_PASSWORD = 'postgres123';
process.env.DB_NAME = 'nestjs_backoffice';

// Configurar timeout global para los tests E2E
jest.setTimeout(30000);

console.log('🔧 Setup E2E configurado correctamente'); 