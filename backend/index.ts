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

// skapa user
app.post("/user", async (request, response) => {
  const { username, password, email } = request.body;
  console.log(request.body);

  const { rows } = await client.query(
    "INSERT INTO users (username, password, email) VALUES ($1, $2, $3)",
    [username, password, email]
  );

  response.status(200).send(rows);
});

// hämta user (baserat på id)?
app.get("/user", async (_request, response) => {
  const users = await client.query("SELECT * FROM users ");
  response.send(users);
});

// hämta alla avatarer
app.get("/avatars", async (_request, response) => {
  const avatars = await client.query("SELECT * FROM avatars");

  response.send(avatars);
});

//hämta medaljer med villkor som uppfylls
app.get("/medals", async (_request, response) => {
  const medals = await client.query("SELECT * FROM medals")
  const userMedals = await client.query("SELECT * from user_medals")

})

//uppdatera antal ggr som användaren har borstat tänderna

//uppdatera medalj till användaren
app.put("/medals", async(_request, response) => {


})


const StartServer = () => {
  client.connect();
  app.listen(port, () => {
    console.log(`Redo på Port http://localhost:${port}/`);
  });
};

StartServer();
