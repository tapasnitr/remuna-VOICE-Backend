import dotenv from 'dotenv';

const ENV = process.env.NODE_ENV || 'development';

dotenv.config({
    path: ENV === 'production' ? '.env.prod' : '.env.local',
});

const { startServer } = await import('./main/server.js');
startServer();
