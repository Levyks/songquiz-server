import { Config } from '@/typings/config';
import { developmentConfig } from './development.config';
import { productionConfig } from './production.config';
import { testingConfig } from './testing.config';

const env = process.env.NODE_ENV || 'development';

export const config: Config =
  env === 'production'
    ? productionConfig
    : env === 'testing'
    ? testingConfig
    : developmentConfig;
