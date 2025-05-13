import express from "express";
import dotenv from "dotenv";
import { Client } from "pg";

dotenv.config();

const client = new Client({
  connectionString: process.env.PGURI,
});

const port = 3000;

const app = express();

app.use(express.json());

app.post("/", async (request, response) => {
  const { username, password, email } = request.body;
  console.log(request.body);

  const { rows } = await client.query(
    "INSERT INTO users (username, password, email) VALUES ($1, $2, $3)",
    [username, password, email]
  );

  response.status(200).send(rows);
});

app.get("/", async (_request, response) => {
  const users = await client.query("SELECT * FROM users ");
  response.send(users);
});

const StartServer = () => {
  client.connect();
  app.listen(port, () => {
    console.log(`Redo på Port http://localhost:${port}/`);
  });
};

StartServer();
