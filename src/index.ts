import 'reflect-metadata';
import { config } from './config';
import { startServer } from './server';
import { registerServices } from './services';

registerServices();
startServer(config.server.port);
