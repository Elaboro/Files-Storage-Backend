**<<< [Main page](https://github.com/Elaboro/Files-Storage-Backend)**

# API documentation 
http://localhost:3000/api/docs/

## Description REST API


### - **POST** `/auth/register`

Create a new account by passing parameters:

```json
{
  "username": "user",
  "password": "user",
  "email": "user@user.user"
}
```
**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ1c2VyIiwiZW1haWwiOiJ1c2VyQHVzZXIudXNlciIsImlhdCI6MTY2NjE1MzI5MCwiZXhwIjoxNjY2MTYwNDkwfQ.T6QncayeGVl-LhmwASRjgy1Bv8gVmDmH3rDhhnFgCR4"
}
```

### - **POST** `/auth/login`

Log in by sending:

```json
{
  "username": "user", // "email": "user@user.user", - registered username or email
  "password": "user"
}
```
**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ1c2VyIiwiZW1haWwiOiJ1c2VyQHVzZXIudXNlciIsImlhdCI6MTY2NjE1MzI5MCwiZXhwIjoxNjY2MTYwNDkwfQ.T6QncayeGVl-LhmwASRjgy1Bv8gVmDmH3rDhhnFgCR4"
}
```

### - **GET** `/storage`

Returns an array with the ID, file name, and the name of the user who uploaded it:

**Response:**
```json
[
  {
    "id": 1,
    "filename": "one.png",
    "username": "user"
  },
  {
    "id": 2,
    "filename": "two.png",
    "username": "user"
  },
  ...
]
```

___

### Access after authorization by JWT token:

### - **POST** `/storage/upload`

Upload files by transferring 32-byte key (aes-256-ctr) for encryption. Key is needed to decrypt and download files. Response contains an array of file IDs.

**Request body:**
```text
key - 32-byte key (aes-256-ctr),
files - array file item (multipart/form-data)
```
**Response:**
```json
[
  1,
  2
]
```

### - **GET** `/storage/download/id/{id}/key/{key}`

Download file from file storage. Substitute parameters instead of **{id}** and **{key}**.
> **Example**: `storage/download/id/1/key/jZ39Sigy2VR2nmMQk7gbP2uDpR4czooD`

```text
id - ID of uploaded file,
key - 32-byte key (aes-256-ctr) of uploaded file.
```
**Response:**

Your file.

### - **DELETE** `/storage/delete/{id}`

Delete file from file storage. Substitute parameters instead of **{id}**.
> **Example**: `/storage/delete/1`

```text
id - ID of uploaded file.
```
**Response:**
```json
{
  "filename": "one.png",
  "id": 1
}
```