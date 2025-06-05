import cors from "cors";
import express, { Request, Response, NextFunction } from "express";
import path from "path"
import dotenv from "dotenv";
import { Client } from "pg";
import { v4 as uuidv4 } from "uuid";
import cookieParser from "cookie-parser";

const port = process.env.PORT || 3000;
const app = express();

dotenv.config();

const client = new Client({
  connectionString: process.env.PGURI,
});

interface MyRequest extends Request {
  user?: {
    user_id: number;
  };
}

interface UserType {
  username: string;
  password: string;
  email: string;
  selectedAvatar: number;
}

interface AvatarType {
  avatar: string;
  id: number;
}

interface MedalType {
  medal_name: string;
  medal_image: string;
  criteria: string;
  user_id: number;
}

interface BrushingSessionType {
  user_id: number;
}

interface TokenType {
  token: string;
}

app.use(express.static(path.join(path.resolve(), "dist")))

//har kvar denna för att kunna publicera på github-pages och egen server i framtiden
app.use(
  cors({
    // origin: "http://localhost:5173",
    origin: ["https://toothbrush-timer.onrender.com", "http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// middleware för autenfificering
async function authenticate(
  request: MyRequest,
  response: Response,
  next: NextFunction
) {
  const token: string = request.cookies && request.cookies.tbtimer_token;
  console.log("token received:", token);

  if (!token) {
    response.status(401).send("finns ingen token");
    return;
  }

  const validToken = await client.query("SELECT * FROM tokens WHERE token=$1", [
    token,
  ]);

  console.log("valid token:", validToken);
  if (validToken.rows.length === 0 || validToken.rows[0].token !== token) {
    response.status(401).send("inte ett giltigt tokenvärde");
    return;
  }

  console.log("hej", validToken.rows);
  request.user = { user_id: validToken.rows[0].user_id };
  console.log("user:", request.user);
  next();
}


//--------------------Logga in, Logga ut------------

// hämta token skicka id
app.get("/token/:token", async (request, response) => {
  const token = request.params.token;

  const { rows: userId } = await client.query(
    "SELECT user_id FROM tokens WHERE token=$1",
    [token]
  );

  if (!userId) {
    response.status(404).send("userId finns ej");
  }

  response.status(200).send(userId[0]);
});

//login
app.post("/login", async (request, response) => {
  const { email, password }: UserType = request.body;

  try {
    const existingUser = await client.query(
      "SELECT * FROM users WHERE email=$1 AND password=$2",
      [email, password]
    );

    if (existingUser.rows.length === 0) {
      response.status(401).send("Epost eller lösenord finns ej");
    }
    const user_id = existingUser.rows[0].id;
    const token = uuidv4();

    await client.query("INSERT INTO tokens (user_id, token) VALUES($1, $2)", [
      user_id,
      token,
    ]);

    response.setHeader("Set-Cookie", `tbtimer_token=${token}; Path=/; Partitioned`);
    response.status(201).send(request.cookies.token);
  } catch (error) {
    response.status(500).send("ett fel har inträffat vid inloggningen" + error);
  }
});

// logout
app.post(
  "/logout",
  authenticate,
  async (request: MyRequest, response: Response) => {
    const user_id = request.user?.user_id;
    if (!user_id) {
      response.status(401).send("du är inte inloggad");
    }
    await client.query("DELETE FROM tokens WHERE user_id=$1", [user_id]);
    response.clearCookie("tbtimer_token");

    response.status(200).send();
  }
);

//--------------------Användare---------------------
// skapa användare
app.post("/user", async (request, response) => {
  const { username, password, email, selectedAvatar }: UserType = request.body;
  console.log(request.body);
  try {
    const { rows: avatars } = await client.query(
      "SELECT * FROM avatars WHERE id = $1",
      [selectedAvatar]
    );

    if (avatars.length === 0) {
      response.status(400).send("No avatar exists");
    }

    const { rows: user } = await client.query(
      "INSERT INTO users (username, password, email, avatar_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [username, password, email, selectedAvatar]
    );

    response.status(201).send(user[0]);
  } catch (error) {
    console.error("Error creating user", error);
    response.status(500).send({ error: "Error while creating a new user" });
  }
});

// hämta användare (baserat på id)
app.get("/user/:id", async (request, response) => {
  const id = request.params.id;
  const { rows: user } = await client.query("SELECT * FROM users WHERE id=$1", [
    id,
  ]);

  if (user.length === 0) response.status(404).send();

  response.send(user[0]);
});

// hämta alla avatarer
app.get("/avatars", async (_request, response) => {
  const { rows: avatar } = await client.query("SELECT * FROM avatars");
  response.send(avatar);
});

//hämta specifik avatar kopplat till användaren
app.get("/avatars/:id", async (request, response) => {
  const avatarId = request.params.id;
  const { rows: avatar } = await client.query(
    "SELECT avatar FROM avatars WHERE id=$1",
    [avatarId]
  );
  response.send(avatar[0]);
});


//-----------------Borsta tänderna-------------------
// lägg till ett värde för varje gång man har borstat tänderna
app.post("/brushing/:id", async (request, response) => {
  const userId = request.params.id;

  const brushingSession = await client.query(
    "INSERT INTO brushing_tracker (user_id) VALUES ($1)",
    [userId]
  );

  if (brushingSession.rowCount === 0) {
    response.status(500).send("Kunde inte lägga in i databasen");
  }

  const { rows: brushingSessionUser } = await client.query(
    "SELECT * FROM brushing_tracker WHERE user_id=$1",
    [userId]
  );

  response.send(brushingSessionUser);
});

//hämta alla tandborsts-sessioner per användare
app.get("/brushing-sessions/:id", async (request, response) => {
  const userId = request.params.id;
  const { rows: brushingSession } = await client.query(
    "SELECT * FROM brushing_tracker WHERE user_id=$1",
    [userId]
  );
  response.send(brushingSession);
});

const StartServer = async () => {
  await client.connect();
  app.listen(port, () => {
    console.log(`Redo på Port http://localhost:${port}/`);
  });
};

StartServer();
