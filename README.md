# School Management System

### Server

## Run Locally

Clone the project

```cmd
  git clone https://github.com/datstek/stadmos-server.git
```

Go to the project directory

```cmd
  cd stadmos-server
```

Install the dependencies

```cmd
  npm install
```

Make a copy of `.env.example` file and rename it to `.env`

Put your environment variables in the `.env` file

Migrate the database

```cmd
node scripts/migrate.js -f
```

The above commands creates all the tables in your database.

Start the server

```cmd
  npm run dev
```
