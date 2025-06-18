import 'dotenv/config';
import { SignOptions } from 'jsonwebtoken';
import z from 'zod';

const envVarsSchema = z.object({
    // SERVER
    PORT: z.coerce.number().default(8000),
    HOSTNAME: z.string().default('127.0.0.1'),
    MONGODB_URL_DEV: z.string().describe('Local Mongo DB'),
    CLIENT_URI: z.string(),
    // OAUTH
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    GOOGLE_REDIRECT_URI: z.string(),
    // TOKEN
    JWT_ACCESS_TOKEN_KEY: z.string().min(1, { message: 'JWT Access Token Key là bắt buộc' }),
    JWT_VERIFY_TOKEN_KEY: z.string().min(1, { message: 'JWT Access Token Key là bắt buộc' }),
    JWT_REFRESH_TOKEN_KEY: z.string().min(1, { message: 'JWT refresh Token Key là bắt buộc' }),
    JWT_REFRESH_EXPIRATION: z.string().default('7d'),
    JWT_VERIFY_EXPIRATION: z.string().default('5m'),
    JWT_ACCESS_EXPIRATION: z.string().default('15m'),
    // MAIL
    EMAIL_USER: z.string().email(),
    EMAIL_PASSWORD: z.string().min(3),
});

const result = envVarsSchema.safeParse(process.env);

if (!result.success) {
    result.error.issues.forEach((issue) => {
        console.error(`❌ Field "${issue.path.join('.')}" - ${issue.message}`);
    });
    console.error('⛔ Stopping application due to missing environment variables.');
    process.exit(1);
}

const envVars = result.data;
const config = {
    port: envVars.PORT,
    hostname: envVars.HOSTNAME,
    mongoose: {
        url: envVars.MONGODB_URL_DEV,
        options: {
            dbName: 'TICFLIX',
        },
    },
    client_uri: envVars.CLIENT_URI,
    google: {
        client_id: envVars.GOOGLE_CLIENT_ID,
        serect_id: envVars.GOOGLE_CLIENT_SECRET,
        redirect_uri: envVars.GOOGLE_REDIRECT_URI,
    },
    jwt: {
        accessTokenKey: envVars.JWT_ACCESS_TOKEN_KEY,
        accessExpiration: envVars.JWT_ACCESS_EXPIRATION as SignOptions['expiresIn'],
        refreshTokenKey: envVars.JWT_REFRESH_TOKEN_KEY,
        refreshTokenExpiration: envVars.JWT_REFRESH_EXPIRATION,
        verifyTokenKey: envVars.JWT_VERIFY_TOKEN_KEY,
        verifyExpiration: envVars.JWT_VERIFY_EXPIRATION as SignOptions['expiresIn'],
    },
    nodeMailer: {
        email: envVars.EMAIL_USER,
        password: envVars.EMAIL_PASSWORD,
    },
};

export default config;
