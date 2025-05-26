"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
// import * as express from 'express';
const dotenv_1 = __importDefault(require("dotenv"));
const pg_1 = require("pg");
const uuid_1 = require("uuid");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const port = 3000;
const app = (0, express_1.default)();
dotenv_1.default.config();
const client = new pg_1.Client({
    connectionString: process.env.PGURI,
});
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
//egen middleware för authentification
function authenticate(request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = (request.query && request.query.token) ||
            (request.body && request.body.token) ||
            (request.headers && request.headers["authorization"]) ||
            (request.cookies && request.cookies.token);
        if (!token) {
            response.status(401).send("finns ingen token");
        }
        const validToken = yield client.query("SELECT * FROM tokens WHERE token=$1", [
            token,
        ]);
        console.log("valid token:", validToken);
        if (validToken.rows.length === 0 || validToken.rows[0].token !== token) {
            response.status(401).send("inte ett giltigt tokenvärde");
        }
        request.user = { user_id: validToken.rows[0].user_id };
        console.log(request.user);
        next();
    });
}
app.get("/token/:token", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const token = request.params.token;
    const { rows: userId } = yield client.query("SELECT user_id FROM tokens WHERE token=$1", [
        token,
    ]);
    if (!userId) {
        response.status(404).send();
    }
    response.status(200).send(userId[0]);
}));
// app.use("/",userRoutes)
//--------------------Skapa och Visa---------------------
// skapa user
app.post("/user", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, email, selectedAvatar } = request.body;
    console.log(request.body);
    try {
        const { rows: avatars } = yield client.query("SELECT * FROM avatars WHERE id = $1", [selectedAvatar]);
        if (avatars.length === 0) {
            response.status(400).send("No avatar exists");
        }
        const { rows: user } = yield client.query("INSERT INTO users (username, password, email, avatar_id) VALUES ($1, $2, $3, $4) RETURNING *", [username, password, email, selectedAvatar]);
        response.status(201).send(user[0]);
    }
    catch (error) {
        console.error("Error creating user", error);
        response.status(500).send({ error: "Error while creating a new user" });
    }
}));
//hämta alla användare
app.get("/user", (_request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { rows: users } = yield client.query("SELECT * FROM users");
    // const user = await client.query(
    //   "SELECT * FROM users INNER JOIN avatars ON users.avatar_id = avatar.id WHERE users.id = $1",
    //   [id]
    // );
    response.send(users);
}));
// hämta user (baserat på id)
app.get("/user/:id", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const id = request.params.id;
    const { rows: user } = yield client.query("SELECT * FROM users WHERE id=$1", [
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
}));
//hämta user baserat på email
app.get("/user/email/:email", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const email = request.params.email;
    const { rows: user } = yield client.query("SELECT * FROM users WHERE email=$1", [
        email,
    ]);
    if (user.length === 0)
        response.status(404).send();
    console.log(user);
    // const user = await client.query(
    //   "SELECT * FROM users INNER JOIN avatars ON users.avatar_id = avatar.id WHERE users.id = $1",
    //   [id]
    // );
    response.send(user[0]);
}));
//login
app.post("/login", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = request.body;
    try {
        const existingUser = yield client.query("SELECT * FROM users WHERE email=$1 AND password=$2", [email, password]);
        if (existingUser.rows.length === 0) {
            response.status(401).send("Epost eller lösenord finns ej");
        }
        const user_id = existingUser.rows[0].id;
        const token = (0, uuid_1.v4)();
        yield client.query("INSERT INTO tokens (user_id, token) VALUES($1, $2)", [
            user_id,
            token,
        ]);
        response.setHeader("Set-Cookie", `tbtimer_token=${token}; Path=/;`);
        // console.log(request.cookies.token)
        response.status(201).send(request.cookies.token);
    }
    catch (error) {
        response.status(500).send("ett fel har inträffat vid inloggningen" + error);
    }
}));
// logout
app.post("/logout", authenticate, (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user_id = (_a = request.user) === null || _a === void 0 ? void 0 : _a.user_id;
    if (!user_id) {
        response.status(401).send("du är inte inloggad");
    }
    yield client.query("DELETE FROM tokens WHERE user_id=$1", [
        user_id,
    ]);
    response.clearCookie("tbtimer_token");
    response.status(200).send();
}));
// hämta alla avatarer
app.get("/avatars", (_request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { rows: avatar } = yield client.query("SELECT * FROM avatars");
    response.send(avatar);
}));
//hämta specifik avatar
app.get("/avatars/:id", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const avatarId = request.params.id;
    const { rows: avatar } = yield client.query("SELECT avatar FROM avatars WHERE id=$1", [avatarId]);
    response.send(avatar[0]);
}));
//Välj avatar till din användare genom att uppdatera users-tabellen
app.post("/user/avatar", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, avatarId } = request.query;
    const myAvatar = yield client.query("UPDATE users SET avatar_id = $1 WHERE id = $2", [avatarId, userId]);
    response.send(myAvatar);
}));
//----------------Logga in---------------------------
//---------------------------------------------------
//     Spel, borsta tänderna, får medalj
//---------------------------------------------------
// lägg till ett värde för varje gång man har borstat tänderna
app.post("/brushing/:id", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = request.params.id;
    const { rows: brushingSession } = yield client.query("INSERT INTO brushing_tracker (user_id) VALUES ($1)", [userId]);
    if (brushingSession.length === 0) {
        response.status(401).send("Tandbortsning ej slutförd och loggad ");
    }
    const { rows: brushingSessionUser } = yield client.query("SELECT * FROM brushing_tracker WHERE user_id=$1", [userId]);
    // const earnedMedal = Math.floor(brushingSession.length / 5);
    //   const newMedal = await client.query(
    //   "INSERT INTO user_medals (user_id, medal_id) VALUES ($1, $2)",
    //   [userId, earnedMedal]
    // );
    response.send(brushingSessionUser);
}));
//hämta alla tandborsts-sessioner per användare och delar med 5 för att få fram hur många medaljer användaren ska ha (antalet avklkarade tandborstsessioner som en användare har klarat)
app.get("/brushingmedals/:id", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = request.params.id;
    const { rows: brushingSession } = yield client.query("SELECT * FROM brushing_tracker WHERE user_id=$1", [userId]);
    // const earnedMedal = Math.floor(brushingSession.length / 5);
    // const newMedal = await client.query(
    //   "INSERT INTO user_medals (user_id, medal_id) VALUES ($1, $2)",
    //   [userId, earnedMedal]
    // );
    // console.log(brushingSession.length);
    // console.log(earnedMedal);
    // console.log(newMedal);
    response.send(brushingSession);
}));
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
const StartServer = () => __awaiter(void 0, void 0, void 0, function* () {
    yield client.connect();
    app.listen(port, () => {
        console.log(`Redo på Port http://localhost:${port}/`);
    });
});
StartServer();
