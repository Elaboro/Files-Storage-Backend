# Files Storage REST API
**[[RU](https://github.com/Elaboro/Files-Storage-REST-API/blob/master/readme/README-RU.md)]**


## Description
A demo REST API that can share files via CDN. It can also work with its own local storage.

The simplest authorization and registration is implemented (JWT). After authorization, you can upload files. They will be compressed, encrypted (transmitted encryption key) and placed in storage (or saved to a remote storage via FTP). Some meta information will also be saved. Uploaded files can be downloaded using the received ID and key, they will be decrypted without compression.
You can also delete the file by passing its ID. Meta information about the file will be deleted along with it.

## To launch the application

Create `.dev.env` and fill in (example: .env.sample)


## Documentation REST API

- **POST** */auth/register*

>Create a new account by passing the parameters:
>
>**username** - username.
>
>**password** - password.
>
>**email** - email.
>
>Token comes in response.

- **POST** */auth/login*

>Log in by sending:
>
>**username** | **email** - registered username or email.
>
>**password** - password.
>
>Token comes in response

- **GET** */storage*

>Returns an array with the ID, file name, and the name of the user who uploaded it.

### Access after authorization by JWT token:

- **POST** */storage/upload*


>Send files by transmitting a 32-byte key in the body (aes-256-ctr).
>
>The response comes with an array of identifiers.

- **GET** */storage/download/id/**{id}**/key/**{key}***


>Upload the file by passing the parameters:
>
>**id** - id of the uploaded file.
>
>**key** - key (32 bytes) used during file sending.

- **DELETE** */storage/delete/**{id}***


>Deleting the file by passing the parameter:
>**id** - id of the uploaded file.
