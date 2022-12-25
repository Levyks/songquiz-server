import { config } from './config';
import { startServer } from './server';

startServer(config.server.port);
