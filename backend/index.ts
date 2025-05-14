import cors from "cors";
import express, {Request, Response} from "express";
import dotenv from "dotenv";
import { Client } from "pg";

const port = 3000;
const app = express();

dotenv.config();

const client = new Client({
  connectionString: process.env.PGURI,
});

interface UserType {
  username: string;
  password: string;
  email: string;
  avatar_id: number;
}

interface AvatarType {
  avatar: string;
}

interface MedalType {
  name: string;
  image: string;
  criteria: string;
}
app.use(cors());
app.use(express.json());

// app.use("/",userRoutes)

//--------------------Skapa och Visa---------------------
// skapa user
app.post("/user", async (request, response) => {
  const { username, password, email }: UserType = request.body;
  console.log(request.body);

  const { rows: user } = await client.query(
    "INSERT INTO users (username, password, email) VALUES ($1, $2, $3)",
    [username, password, email]
  );

  response.status(201).send(user);
});

// hämta user (baserat på id)
app.get("/user/:id", async (request, response) => {
  const id = request.params.id;
  const { rows: user } = await client.query("SELECT * FROM users WHERE id=$1", [
    id,
  ]);
  // const user = await client.query(
  //   "SELECT * FROM users INNER JOIN avatars ON users.avatar_id = avatar.id WHERE users.id = $1",
  //   [id]
  // );
  response.send(user);
});

// hämta alla avatarer
app.get("/avatars", async (_request, response) => {
  const { rows: avatar } = await client.query("SELECT * FROM avatars");

  response.send(avatar);
});

//Välj avatar till din användare genom att uppdatera users-tabellen
app.post("/user/avatar", async (request, response) => {
  const { userId, avatarId } = request.query;

  //validering

  const myAvatar = await client.query(
    "UPDATE users SET avatar_id = $1 WHERE id = $2",
    [avatarId, userId]
  );

  response.send(myAvatar);
});

//----------------Logga in---------------------------

//---------------------------------------------------
//     Spel, borsta tänderna, får medalj
//---------------------------------------------------

//hämta medaljer
app.get("/medals", async (_request, response) => {
  const { rows: medals } = await client.query("SELECT * FROM medals");
  response.send(medals);
});

//tilldela ny medalj till användaren
app.post("/medals/", async (request, response) => {
  const { userId, medalId } = request.query as {userId: string; medalId: string
  };

  // kolla om medaljen redan är tilldelad till användaren
  // const { rows: userMedals } = await client.query("SELECT * FROM user_medals WHERE user_id = $1 AND medal_id = ( $2,)", [userId, medalId]);

  // if(userMedals.length === 0){
  //    return response.send("du har redan denna medalj")
  // }

  //annars tilldela ny medalj
  const { rows: newMedal } = await client.query(
    "INSERT INTO user_medals (user_id, medal_id) VALUES ($1, $2)",
    [userId, medalId]
  );

  response.send(newMedal);
});

//hämta  medaljer för en specifik användare
app.get("/medals/:userId", async (request, response) => {
  const id = request.params.userId;
  const { rows: medals } = await client.query(
    "SELECT * FROM user_medals WHERE user_id=$1",
    [id]
  );

  response.send(medals);
});

const StartServer = () => {
  client.connect();
  app.listen(port, () => {
    console.log(`Redo på Port http://localhost:${port}/`);
  });
};

StartServer();
