import cors from "cors";
import express, { Request, Response, NextFunction } from "express";
// import * as express from 'express';
import dotenv from "dotenv";
import { Client } from "pg";
import { v4 as uuidv4 } from "uuid";
import cookieParser from "cookie-parser";

const port = 3000;
const app = express();

dotenv.config();

const client = new Client({
  connectionString: process.env.PGURI,
});

interface MyRequest extends Request {
  user?: {
    user_id : number
  }
}

// declare global {
//   namespace express {
//     export interface Request {
//       user: {
//         user_id: number;
//       };
//     }
//   }
// }

// interface Request  {
//   headers: any;
//   body: any;
//   query: any;
//   cookies: any;
//   user?: {
//     user_id: number;
//   };
// }

// interface Response{

// }

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
  medal_name: string
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

app.use(cors(
  {
    origin: 'http://localhost:5173',
    credentials: true
  }
));
app.use(express.json());
app.use(cookieParser());

//egen middleware för authentification

async function authenticate(
  request: MyRequest,
  response: Response,
  next: NextFunction
) {
  const token: string =
    (request.query && request.query.token) ||
    (request.body && request.body.token) ||
    (request.headers && request.headers["authorization"]) ||
    (request.cookies && request.cookies.token);

  if (!token) {
    response.status(401).send("finns ingen token");
  }

  const validToken = await client.query("SELECT * FROM tokens WHERE token=$1", [
    token,
  ]);

  console.log("valid token:", validToken);
  if (validToken.rows.length === 0 || validToken.rows[0].token !== token) {
    response.status(401).send("inte ett giltigt tokenvärde");
  }

  request.user = { user_id: validToken.rows[0].user_id };
  console.log(request.user);
  next();
}

app.get("/token/:token", async (request, response)=> {
  const token = request.params.token

  const {rows: userId} = await client.query("SELECT user_id FROM tokens WHERE token=$1", [
    token,
  ]);

  if (!userId){
  response.status(404).send();
  }


  response.status(200).send(userId[0])

})
// app.use("/",userRoutes)

//--------------------Skapa och Visa---------------------
// skapa user
app.post("/user", async (request, response) => {
  const { username, password, email, selectedAvatar }: UserType = request.body;
  console.log(request.body);
 try{
  const { rows: avatars } = await client.query("SELECT * FROM avatars WHERE id = $1", [selectedAvatar])

  if(avatars.length === 0){
    response.status(400).send("No avatar exists")
  }

  const { rows: user } = await client.query(
    "INSERT INTO users (username, password, email, avatar_id) VALUES ($1, $2, $3, $4) RETURNING *",
    [username, password, email, selectedAvatar]
  );

  response.status(201).send(user[0]);

 } catch(error){
  console.error("Error creating user", error);
  response.status(500).send({error: "Error while creating a new user"})
 }

});
//hämta alla användare
app.get("/user", async (_request, response) => {
  const { rows: users } = await client.query("SELECT * FROM users");
  // const user = await client.query(
  //   "SELECT * FROM users INNER JOIN avatars ON users.avatar_id = avatar.id WHERE users.id = $1",
  //   [id]
  // );
  response.send(users);
});

// hämta user (baserat på id)
app.get("/user/:id", async (request, response) => {
  const id = request.params.id;
  const { rows: user } = await client.query("SELECT * FROM users WHERE id=$1", [
    id,
  ]);

    if (user.length === 0)
      response.status(404).send();

    // const user = await client.query(
  //   "SELECT * FROM users INNER JOIN avatars ON users.avatar_id = avatar.id WHERE users.id = $1",
  //   [id]
  // );

  console.log(user);

  response.send(user[0]);
});

//hämta user baserat på email
app.get("/user/email/:email", async (request, response) => {
  const email = request.params.email;
  const { rows: user } = await client.query("SELECT * FROM users WHERE email=$1", [
    email,
  ]);

  if (user.length === 0)
    response.status(404).send();

  console.log(user)

  // const user = await client.query(
  //   "SELECT * FROM users INNER JOIN avatars ON users.avatar_id = avatar.id WHERE users.id = $1",
  //   [id]
  // );

  response.send(user[0]);
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

    response.setHeader("Set-Cookie", `tbtimer_token=${token}; Path=/;`);
    // console.log(request.cookies.token)
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
    await client.query("DELETE FROM tokens WHERE user_id=$1", [
      user_id,
    ]);
    response.clearCookie("tbtimer_token");
    response.status(200).send();
  }
);

// hämta alla avatarer
app.get("/avatars", async (_request, response) => {
  const { rows: avatar } = await client.query("SELECT * FROM avatars");
  response.send(avatar);
});

//hämta specifik avatar
app.get("/avatars/:id", async (request, response) => {
  const avatarId = request.params.id
  const { rows: avatar } = await client.query("SELECT avatar FROM avatars WHERE id=$1", [avatarId]);
  response.send(avatar[0]);
});

//Välj avatar till din användare genom att uppdatera users-tabellen
app.post("/user/avatar", async (request, response) => {
  const { userId, avatarId } = request.query;

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

// lägg till ett värde för varje gång man har borstat tänderna
app.post("/brushing/:id", async (request, response) => {
  const userId = request.params.id;

  const { rows: brushingSession } = await client.query(
    "INSERT INTO brushing_tracker (user_id) VALUES ($1)",
    [userId]
  );

  if(brushingSession.length === 0 ){
    response.status(401).send("Tandbortsning ej slutförd och loggad ");
  }

  const { rows: brushingSessionUser } = await client.query(
    "SELECT * FROM brushing_tracker WHERE user_id=$1",
    [userId]
  );

  // const earnedMedal = Math.floor(brushingSession.length / 5);

  //   const newMedal = await client.query(
  //   "INSERT INTO user_medals (user_id, medal_id) VALUES ($1, $2)",
  //   [userId, earnedMedal]
  // );


  response.send(brushingSessionUser);
});

//hämta alla tandborsts-sessioner per användare och delar med 5 för att få fram hur många medaljer användaren ska ha (antalet avklkarade tandborstsessioner som en användare har klarat)
app.get("/brushingmedals/:id", async (request, response) => {
  const userId = request.params.id;
  const { rows: brushingSession } = await client.query(
    "SELECT * FROM brushing_tracker WHERE user_id=$1",
    [userId]
  );

  // const earnedMedal = Math.floor(brushingSession.length / 5);

  // const newMedal = await client.query(
  //   "INSERT INTO user_medals (user_id, medal_id) VALUES ($1, $2)",
  //   [userId, earnedMedal]
  // );

  // console.log(brushingSession.length);

  // console.log(earnedMedal);
  // console.log(newMedal);

  response.send(brushingSession);
});

// //hämta medaljer
// app.get("/medals", async (_request, response) => {
//   const { rows: medals } = await client.query("SELECT * FROM medals");
//   response.send(medals);
// });

// //tilldela ny medalj till användaren
// app.post("/medals/", async (request, response) => {
//   const { userId, medalId } = request.query as {
//     userId: string;
//     medalId: string;
//   };

  // kolla om medaljen redan är tilldelad till användaren
  // const { rows: userMedals } = await client.query("SELECT * FROM user_medals WHERE user_id = $1 AND medal_id = $2,", [userId, medalId]);

  // if(userMedals.length === 0){
  //    return response.send("du har redan denna medalj")
  // }

//   //annars tilldela ny medalj
//   const { rows: newMedal } = await client.query(
//     "INSERT INTO user_medals (user_id, medal_id) VALUES ($1, $2)",
//     [userId, medalId]
//   );

//   response.send(newMedal);
// });

// //hämta  medaljer för en specifik användare
// app.get("/medals/:userId", async (request, response) => {
//   const id = request.params.userId;
//   const { rows: medals } = await client.query(
//     "SELECT * FROM user_medals WHERE user_id=$1",
//     [id]
//   );

//   response.send(medals);
// });

const StartServer = async () => {
  await client.connect();
  app.listen(port, () => {
    console.log(`Redo på Port http://localhost:${port}/`);
  });
};

StartServer();
