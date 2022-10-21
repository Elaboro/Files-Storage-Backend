**<<< [Main page](https://github.com/Elaboro/Files-Storage-Backend#files-storage-backend)**

# Migrations
Enter into container shell to work with migrations `docker-compose exec storage sh`
> **Example:** `NAME=name_migration npm run migration:create`

#### Create migration:
`NAME=<name> npm run migration:create`

#### Generate migration:
`NAME=<name> npm run migration:generate`

#### Perform all migrations:
`npm run migration:run`

#### Go back one migration ago:
`npm run migration:revert`
