# Backend with Express, Prisma and PostgreSQL

This test is performed using [Express](https://expressjs.com/), [PostgresSQL](https://www.postgresql.org/) and [Prisma Client](https://www.prisma.io/docs/concepts/components/prisma-client).

## Getting started

### 1. Download and install dependencies

Clone this repository:

```
git clone
```

Install npm dependencies:

```
npm install
```

</details>

### 2. Setup PostgreSQL

- Create a database in your PostgreSQL

- Connect to Postgres by any database viewer of your choice.

- Rename the `.env.example` to `.env` and replace the _DBNAME_ placeholder with the database name.

Run the following command to create the tables and the function required for this example.

```
npx prisma migrate deploy
```

- Lastly run the following command to generate Prisma Client.

```
npx prisma generate
```


### 3. Start the REST API server

Execute this command to start the server:

```
npm run dev
```

The server is now running on `http://localhost:3000`. You can send the API requests implemented in [`index.ts`](./src/index.ts)

## Using the API

You can access the API using the following endpoints:

### `POST`

- `/games`: Create a new Game

  - Body:
    ```
    {
        "ubicacion": "Sample Location",
        "fecha": "2023-10-24T12:00:00Z",
        "equipos": "Team A vs Team B",
        "image": "base64_encoded_image_data"
    }
    ```


### `GET`

- `/games`: Get all games



### `PUT`

- `/games/:id`: Update a Game

  - Body:
    ```
    {
        "ubicacion": "Update Sample Location",
        "fecha": "2023-10-24T12:00:00Z",
        "equipos": "Update Team A vs Team B",
        "image": "base64_encoded_image_data"
    }
    ```

### `DELETE`

- `/games/:id`: Delete games by ID
