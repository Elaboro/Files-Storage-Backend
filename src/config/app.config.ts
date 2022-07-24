import { ConfigModule } from '@nestjs/config';

export default (() => {

  ConfigModule.forRoot({
    envFilePath: `.${process.env.NODE_ENV}.env`,
    cache: true,
    isGlobal: true
  });

  return {
    PORT: process.env.PORT,
    POSTGRES_HOST: process.env.POSTGRES_HOST,
    POSTGRES_PORT: Number(process.env.POSTGRES_PORT),
    POSTGRES_USERNAME: process.env.POSTGRES_USERNAME,
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
    POSTGRES_DATABASE: process.env.POSTGRES_DATABASE,
    JWT_SECRET_KEY: `${process.env.JWT_SECRET_KEY}`,
    JWT_EXPIRATION_TIME: process.env.JWT_EXPIRATION_TIME,
    STORAGE_LOCAL: process.env.STORAGE_LOCAL,
    CDN_URL: process.env.CDN_URL,
    FTP_HOST: process.env.FTP_HOST,
    FTP_PORT: Number(process.env.FTP_PORT),
    FTP_USER: process.env.FTP_USER,
    FTP_PASSWORD: process.env.FTP_PASSWORD,
  };
})();
