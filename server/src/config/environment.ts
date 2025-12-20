import dotenv from 'dotenv';

dotenv.config();

interface Environment {
  NODE_ENV: string;
  PORT: number;
  HOST: string;
  MONGO_URI: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  CLIENT_URL: string;
  GRAPHQL_PATH: string;
  GRAPHQL_SUBSCRIPTIONS_PATH: string;
}

const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export const env: Environment = {
  NODE_ENV: getEnvVar('NODE_ENV', 'development'),
  PORT: parseInt(getEnvVar('PORT', '4000'), 10),
  HOST: getEnvVar('HOST', '0.0.0.0'),
  MONGO_URI: getEnvVar('MONGO_URI', 'mongodb://localhost:27017/taskflow'),
  JWT_SECRET: getEnvVar('JWT_SECRET'),
  JWT_EXPIRES_IN: getEnvVar('JWT_EXPIRES_IN', '7d'),
  CLIENT_URL: getEnvVar('CLIENT_URL', 'http://localhost:3000'),
  GRAPHQL_PATH: getEnvVar('GRAPHQL_PATH', '/graphql'),
  GRAPHQL_SUBSCRIPTIONS_PATH: getEnvVar('GRAPHQL_SUBSCRIPTIONS_PATH', '/graphql'),
};

export const isDevelopment = env.NODE_ENV === 'development';
export const isProduction = env.NODE_ENV === 'production';
export const isTest = env.NODE_ENV === 'test';
