**<<< [Main page](https://github.com/Elaboro/Files-Storage-Backend#files-storage-backend)**

# Launch in Docker Compose

### Launch
- create and configure `.dev.env` by analogy with `.env.sample`

Set variables from example:
```env
POSTGRES_HOST=postgres
POSTGRES_PORT=5432

COMPOSE_PGADMIN_DEFAULT_EMAIL=admin@admin.admin
COMPOSE_PGADMIN_DEFAULT_PASSWORD=admin
```

- `docker-compose --env-file .dev.env up --build`
- Enter into container shell `docker-compose exec storage sh`
- Perform all migrations inside container `npm run migration:run`

### You can connect to database from pgAdmin

http://localhost:5050/
