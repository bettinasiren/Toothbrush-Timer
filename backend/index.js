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
const dotenv_1 = __importDefault(require("dotenv"));
const pg_1 = require("pg");
const port = 3000;
const app = (0, express_1.default)();
dotenv_1.default.config();
const client = new pg_1.Client({
    connectionString: process.env.PGURI,
});
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// app.use("/",userRoutes)
//--------------------Skapa och Visa---------------------
// skapa user
app.post("/user", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, email } = request.body;
    console.log(request.body);
    const { rows: user } = yield client.query("INSERT INTO users (username, password, email) VALUES ($1, $2, $3)", [username, password, email]);
    response.status(201).send(user);
}));
// hämta user (baserat på id)
app.get("/user/:id", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const id = request.params.id;
    const { rows: user } = yield client.query("SELECT * FROM users WHERE id=$1", [
        id,
    ]);
    // const user = await client.query(
    //   "SELECT * FROM users INNER JOIN avatars ON users.avatar_id = avatar.id WHERE users.id = $1",
    //   [id]
    // );
    response.send(user);
}));
// hämta alla avatarer
app.get("/avatars", (_request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { rows: avatar } = yield client.query("SELECT * FROM avatars");
    response.send(avatar);
}));
//Välj avatar till din användare genom att uppdatera users-tabellen
app.post("/user/avatar", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, avatarId } = request.query;
    //validering
    const myAvatar = yield client.query("UPDATE users SET avatar_id = $1 WHERE id = $2", [avatarId, userId]);
    response.send(myAvatar);
}));
//----------------Logga in---------------------------
//---------------------------------------------------
//     Spel, borsta tänderna, får medalj
//---------------------------------------------------
//hämta medaljer
app.get("/medals", (_request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { rows: medals } = yield client.query("SELECT * FROM medals");
    response.send(medals);
}));
//tilldela ny medalj till användaren
app.post("/medals/", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, medalId } = request.query;
    // kolla om medaljen redan är tilldelad till användaren
    // const { rows: userMedals } = await client.query("SELECT * FROM user_medals WHERE user_id = $1 AND medal_id = ( $2,)", [userId, medalId]);
    // if(userMedals.length === 0){
    //    return response.send("du har redan denna medalj")
    // }
    //annars tilldela ny medalj
    const { rows: newMedal } = yield client.query("INSERT INTO user_medals (user_id, medal_id) VALUES ($1, $2)", [userId, medalId]);
    response.send(newMedal);
}));
//hämta  medaljer för en specifik användare
app.get("/medals/:userId", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const id = request.params.userId;
    const { rows: medals } = yield client.query("SELECT * FROM user_medals WHERE user_id=$1", [id]);
    response.send(medals);
}));
const StartServer = () => {
    client.connect();
    app.listen(port, () => {
        console.log(`Redo på Port http://localhost:${port}/`);
    });
};
StartServer();
