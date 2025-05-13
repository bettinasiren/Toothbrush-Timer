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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const pg_1 = require("pg");
dotenv_1.default.config();
const client = new pg_1.Client({
    connectionString: process.env.PGURI,
});
const port = 3000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
// skapa user
app.post("/user", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, email } = request.body;
    console.log(request.body);
    const { rows } = yield client.query("INSERT INTO users (username, password, email) VALUES ($1, $2, $3)", [username, password, email]);
    response.status(200).send(rows);
}));
// hämta user (baserat på id)?
app.get("/user", (_request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield client.query("SELECT * FROM users ");
    response.send(users);
}));
// hämta alla avatarer
app.get("/avatars", (_request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const avatars = yield client.query("SELECT * FROM avatars");
    response.send(avatars);
}));
//hämta medaljer med villkor som uppfylls
app.get("/medals", (_request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const medals = yield client.query("SELECT * FROM medals");
    const userMedals = yield client.query("SELECT * from user_medals");
}));
//uppdatera antal ggr som användaren har borstat tänderna
//uppdatera medalj till användaren
app.put("/medals", (_request, response) => __awaiter(void 0, void 0, void 0, function* () {
}));
const StartServer = () => {
    client.connect();
    app.listen(port, () => {
        console.log(`Redo på Port http://localhost:${port}/`);
    });
};
StartServer();
