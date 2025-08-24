const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3000),
    MONGODB_URL: Joi.string().required().description('Mongo DB url'),
    SMTP_HOST: Joi.string().description('server that will send the emails'),
    SMTP_PORT: Joi.number().description('port to connect to the email server'),
    SMTP_USERNAME: Joi.string().description('username for email server'),
    SMTP_PASSWORD: Joi.string().description('password for email server'),
    EMAIL_FROM: Joi.string().description('the from field in the emails sent by the app'),
    BUCKET_NAME: Joi.string().required().description('AWS S3 bucket name'),
    BUCKET_REGION: Joi.string().required().description('AWS S3 bucket region'),
    ACCESS_KEY_ID: Joi.string().required().description('AWS access key ID'),
    SECRET_ACCESS_KEY: Joi.string().required().description('AWS secret access key'),
    API_KEYS_PER_PROJECT_LIMIT: Joi.number().default(3).description('Maximum number of API keys allowed per project')
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongoose: {
    url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  aws: {
    accessKeyId: envVars.ACCESS_KEY_ID,
    secretAccessKey: envVars.SECRET_ACCESS_KEY,
    bucketName: envVars.BUCKET_NAME,
    bucketRegion: envVars.BUCKET_REGION,
  },
  email: {
    smtp: {
      host: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
      auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD,
      },
    },
    gmail: {
      service: envVars.GMAIL_SERVICE,
      host: envVars.GMAIL_HOST,
      port: envVars.GMAIL_PORT,
      auth: {
        user: envVars.GMAIL_USER,
        pass: envVars.GMAIL_PASS,
      },
    },
    from: envVars.EMAIL_FROM,
  },
  apiKeysLimit: envVars.API_KEYS_PER_PROJECT_LIMIT
};
