import cors from "cors";
import express, { Request, Response, NextFunction } from "express";
import path from "path";
import dotenv from "dotenv";
import { Client } from "pg";
import { v4 as uuidv4 } from "uuid";
import cookieParser from "cookie-parser";

const port = process.env.PORT || 3002;
const app = express();

dotenv.config();

const client = new Client({
  connectionString: process.env.PGURI,
});

interface MyRequest extends Request {
  cookies: Cookies;
  user?: {
    user_id: number;
  };
}
interface Cookies {
  tbtimer_token?: string;
}

interface UserType {
  username: string;
  password: string;
  email: string;
  selectedAvatar: number;
}

interface UserIdResult {
  user_id: string;
}

interface User {
  id: string;
  email: string;
  password: string;
  avatar_id: number;
}

interface AvatarType {
  avatar: string;
  id: number;
}

interface BrushingSessionType {
  user_id: number;
}

app.use(express.static(path.join(path.resolve(), "dist")));

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
  try {
    const token: string | undefined =
      request.cookies && request.cookies.tbtimer_token;

    if (!token) {
      response.status(401).send("Token not exists");
      return;
    }

    const validToken = await client.query(
      "SELECT * FROM tokens WHERE token=$1",
      [token]
    );

    if (validToken.rows.length === 0 || validToken.rows[0].token !== token) {
      response.status(401).send("Not a valid token");
      return;
    }

    request.user = { user_id: validToken.rows[0].user_id };

    next();
  } catch (error) {
    if (error instanceof Error) {
      console.error(
        "An error has occurred during authentication.",
        error.message
      );
      response
        .status(500)
        .send("An error has occurred during authentication:" + error.message);
    } else {
      console.error("An error has occurred during authentication:", error);
      response.status(500).send("An error has occurred during authentication");
    }
  }
}

//--------------------Logga in, Logga ut------------

// hämta token skicka id
app.get("/token/:token", async (request, response) => {
  try {
    const token = request.params.token;

    const { rows: userId }: { rows: UserIdResult[] } = await client.query(
      "SELECT user_id FROM tokens WHERE token=$1",
      [token]
    );

    if (!userId) {
      response.status(404).send("userId not exists ");
      return;
    }

    console.log(userId[0]);
    response.status(200).send(userId[0]);
  } catch (error) {
    if (error instanceof Error) {
      console.error(
        "An error occurred while retrieving the token:",
        error.message
      );
      response
        .status(500)
        .send("An error occurred while retrieving the token:" + error.message);
    } else {
      console.error("An error occurred while retrieving the token:", error);
      response
        .status(500)
        .send("An error occurred while retrieving the token.");
    }
  }
});

//login
app.post("/login", async (request: Request<{}, {}, UserType>, response) => {
  const { email, password } = request.body;

  try {
    const existingUser = await client.query<User>(
      "SELECT * FROM users WHERE email=$1 AND password=$2",
      [email, password]
    );

    if (existingUser.rows.length === 0) {
      response.status(401).send("Email and passoword does not exists");
    }
    const user_id = existingUser.rows[0].id;
    const token = uuidv4();

    await client.query("INSERT INTO tokens (user_id, token) VALUES($1, $2)", [
      user_id,
      token,
    ]);

    response.setHeader(
      "Set-Cookie",
      `tbtimer_token=${token}; Path=/; Partitioned`
    );
    response.status(201).send(request.cookies.token);
  } catch (error) {
    if (error instanceof Error) {
      console.error("An error has occurred during login:", error.message);
      response
        .status(500)
        .send("An error has occurred during login:" + error.message);
    } else {
      console.error("An error has occurred during login:" + error);
      response.status(500).send("An error has occurred during login.");
    }
  }
});

// logout
app.post(
  "/logout",
  authenticate,
  async (request: MyRequest, response: Response) => {
    try {
      const user_id = request.user?.user_id;
      if (!user_id) {
        response.status(401).send("You are not logged in");
      }
      await client.query("DELETE FROM tokens WHERE user_id=$1", [user_id]);
      response.clearCookie("tbtimer_token");

      response.status(200).send();
    } catch (error) {
      if (error instanceof Error) {
        console.error("An error has occurred during logout:", error.message);
        response
          .status(500)
          .send("An error has occurred during logout:" + error.message);
      } else {
        console.error("An error has occurred during logout:", error);
        response.status(500).send("An error has occurred during logout.");
      }
    }
  }
);

//--------------------Användare---------------------
// skapa användare
app.post("/user", async (request, response) => {
  const { username, password, email, selectedAvatar }: UserType = request.body;
  console.log(request.body);
  try {
    const { rows: avatars }: { rows: AvatarType[] } = await client.query(
      "SELECT * FROM avatars WHERE id = $1",
      [selectedAvatar]
    );

    if (avatars.length === 0) {
      response.status(400).send("No avatar exists");
    }

    const { rows: user }: { rows: User[] } = await client.query(
      "INSERT INTO users (username, password, email, avatar_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [username, password, email, selectedAvatar]
    );

    response.status(201).send(user[0]);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error creating user", error);
      response
        .status(500)
        .send("Error while creating a new user:" + error.message);
    }
    console.error("Error creating user", error);
    response.status(500).send("Error while creating a new user");
  }
});

// hämta användare (baserat på id)
app.get("/user/:id", async (request, response) => {
  try {
    const id = request.params.id;
    const { rows: user }: { rows: User[] } = await client.query(
      "SELECT * FROM users WHERE id=$1",
      [id]
    );

    if (user.length === 0) response.status(404).send("User not found");

    response.send(user[0]);
  } catch (error) {
    if (error instanceof Error) {
      console.error(
        "An error occurred while retrieving the user:",
        error.message
      );
      response
        .status(500)
        .send("An error occurred while retrieving the user:" + error.message);
    } else {
      console.error("An error occurred while retrieving the user:", error);
      response.status(500).send("An error occurred while retrieving the userS");
    }
  }
});

// hämta alla avatarer
app.get("/avatars", async (_request, response) => {
  try {
    const { rows: avatar }: { rows: AvatarType[] } = await client.query(
      "SELECT * FROM avatars"
    );
    response.send(avatar);
  } catch (error) {
    if (error instanceof Error) {
      console.error(
        "An error occurred while retrieving avatars:",
        error.message
      );
      response
        .status(500)
        .send("An error occurred while retrieving avatars: " + error.message);
    } else {
      console.error("An unknown error occurred:", error);
      response.status(500).send("An unknown error occurred");
    }
  }
});

//hämta specifik avatar kopplat till användaren
app.get("/avatars/:id", async (request, response) => {
  try {
    const avatarId = request.params.id;
    const { rows: avatar }: { rows: AvatarType[] } = await client.query(
      "SELECT avatar FROM avatars WHERE id=$1",
      [avatarId]
    );
    response.send(avatar[0]);
  } catch (error) {
    if (error instanceof Error) {
      console.error(
        "An error occurred while retrieving user avatar:",
        error.message
      );
      response
        .status(500)
        .send(
          "An error occurred while retrieving user avatar: " + error.message
        );
    } else {
      console.error("An unknown error occurred:", error);
      response.status(500).send("An unknown error occurred");
    }
  }
});

//-----------------Borsta tänderna-------------------
// lägg till ett värde för varje gång man har borstat tänderna
app.post("/brushing/:id", async (request, response) => {
  try {
    const userId = request.params.id;

    const brushingSession = await client.query<BrushingSessionType>(
      "INSERT INTO brushing_tracker (user_id) VALUES ($1)",
      [userId]
    );

    if (brushingSession.rowCount === 0) {
      response.status(500).send("Could not insert into database");
    }

    const { rows: brushingSessionUser }: { rows: BrushingSessionType[] } =
      await client.query("SELECT * FROM brushing_tracker WHERE user_id=$1", [
        userId,
      ]);

    response.send(brushingSessionUser);
  } catch (error) {
    if (error instanceof Error) {
      console.error(
        "An error occurred while processing the brushing session:",
        error.message
      );
      response
        .status(500)
        .send(
          "An error occurred while processing the brushing session: " +
            error.message
        );
    } else {
      console.error("An unknown error occurred:", error);
      response.status(500).send("An unknown error occurred");
    }
  }
});

//hämta alla tandborsts-sessioner per användare
app.get("/brushing-sessions/:id", async (request, response) => {
  try {
    const userId = request.params.id;
    const { rows: brushingSession } : {rows: BrushingSessionType[]} = await client.query(
      "SELECT * FROM brushing_tracker WHERE user_id=$1",
      [userId]
    );
    response.send(brushingSession);
  } catch (error) {
    if (error instanceof Error) {
      console.error(
        "An error occurred while retrieving the brushing session:",
        error.message
      );
      response
        .status(500)
        .send(
          "An error occurred while retrieving the brushing session: " +
            error.message
        );
    } else {
      console.error("An unknown error occurred:", error);
      response.status(500).send("An unknown error occurred");
    }
  }
});

const StartServer = async () => {
  await client.connect();
  app.listen(port, () => {
    console.log(`Redo på Port http://localhost:${port}/`);
  });
};

StartServer();
