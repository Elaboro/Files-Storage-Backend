# Files Storage Backend

## Description
A demo REST API that can share files via CDN. It can also work with its own local storage.

The simplest authorization and registration is implemented (JWT). After authorization, you can upload files. They will be compressed, encrypted (transmitted encryption key) and placed in storage (or saved to a remote storage via FTP). Some meta information will also be saved. Uploaded files can be downloaded using the received ID and key, they will be decrypted without compression.
You can also delete the file by passing its ID. Meta information about the file will be deleted along with it.

## Main technology stack
**Node.js**, **TypeScript**, **Nest.js**, **TypeORM** and migrations, **PostgreSQL**, **Swagger**, **Docker**

## Launch application
**[Alternative launch in docker](https://github.com/Elaboro/Files-Storage-Backend/blob/master/docs/docker.md)**

- prepare postgres database
- create and configure `.dev.env` by analogy with `.env.sample`
- `npm i`
- `npm run migration:run` - use with superuser, because migration creates an extension "uuid-ossp"
- `npm start`

> Configuration `.prod.env` is used for production version.

## API documentation
**[SEE MORE](https://github.com/Elaboro/Files-Storage-Backend/blob/master/docs/api.md)** or http://localhost:3000/api/docs/

## Migrations
**[SEE MORE](https://github.com/Elaboro/Files-Storage-Backend/blob/master/docs/migrations.md)**