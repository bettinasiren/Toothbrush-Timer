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
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const pg_1 = require("pg");
const uuid_1 = require("uuid");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const port = process.env.PORT || 3002;
const app = (0, express_1.default)();
dotenv_1.default.config();
const client = new pg_1.Client({
    connectionString: process.env.PGURI,
});
app.use(express_1.default.static(path_1.default.join(path_1.default.resolve(), "dist")));
//har kvar denna för att kunna publicera på github-pages och egen server i framtiden
app.use((0, cors_1.default)({
    // origin: "http://localhost:5173",
    origin: ["https://toothbrush-timer.onrender.com", "http://localhost:5173"],
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// middleware för autenfificering
function authenticate(request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const token = request.cookies && request.cookies.tbtimer_token;
            if (!token) {
                response.status(401).send("Token not exists");
                return;
            }
            const validToken = yield client.query("SELECT * FROM tokens WHERE token=$1", [token]);
            if (validToken.rows.length === 0 || validToken.rows[0].token !== token) {
                response.status(401).send("Not a valid token");
                return;
            }
            request.user = { user_id: validToken.rows[0].user_id };
            next();
        }
        catch (error) {
            if (error instanceof Error) {
                console.error("An error has occurred during authentication.", error.message);
                response
                    .status(500)
                    .send("An error has occurred during authentication:" + error.message);
            }
            else {
                console.error("An error has occurred during authentication:", error);
                response.status(500).send("An error has occurred during authentication");
            }
        }
    });
}
//--------------------Logga in, Logga ut------------
// hämta token skicka id
app.get("/token/:token", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = request.params.token;
        const { rows: userId } = yield client.query("SELECT user_id FROM tokens WHERE token=$1", [token]);
        if (!userId) {
            response.status(404).send("userId not exists ");
            return;
        }
        response.status(200).send(userId[0]);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("An error occurred while retrieving the token:", error.message);
            response
                .status(500)
                .send("An error occurred while retrieving the token:" + error.message);
        }
        else {
            console.error("An error occurred while retrieving the token:", error);
            response
                .status(500)
                .send("An error occurred while retrieving the token.");
        }
    }
}));
//login
app.post("/login", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = request.body;
    try {
        const existingUser = yield client.query("SELECT * FROM users WHERE email=$1 AND password=$2", [email, password]);
        if (existingUser.rows.length === 0) {
            response.status(401).send("Email and passoword does not exists");
        }
        const user_id = existingUser.rows[0].id;
        const token = (0, uuid_1.v4)();
        yield client.query("INSERT INTO tokens (user_id, token) VALUES($1, $2)", [
            user_id,
            token,
        ]);
        response.setHeader("Set-Cookie", `tbtimer_token=${token}; Path=/; Partitioned`);
        response.status(201).send(request.cookies.token);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("An error has occurred during login:", error.message);
            response
                .status(500)
                .send("An error has occurred during login:" + error.message);
        }
        else {
            console.error("An error has occurred during login:" + error);
            response.status(500).send("An error has occurred during login.");
        }
    }
}));
// logout
app.post("/logout", authenticate, (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user_id = (_a = request.user) === null || _a === void 0 ? void 0 : _a.user_id;
        if (!user_id) {
            response.status(401).send("You are not logged in");
        }
        yield client.query("DELETE FROM tokens WHERE user_id=$1", [user_id]);
        response.clearCookie("tbtimer_token");
        response.status(200).send();
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("An error has occurred during logout:", error.message);
            response
                .status(500)
                .send("An error has occurred during logout:" + error.message);
        }
        else {
            console.error("An error has occurred during logout:", error);
            response.status(500).send("An error has occurred during logout.");
        }
    }
}));
//--------------------Användare---------------------
// skapa användare
app.post("/user", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, email, selectedAvatar } = request.body;
    try {
        const { rows: avatars } = yield client.query("SELECT * FROM avatars WHERE id = $1", [selectedAvatar]);
        if (avatars.length === 0) {
            response.status(400).send("No avatar exists");
        }
        const { rows: user } = yield client.query("INSERT INTO users (username, password, email, avatar_id) VALUES ($1, $2, $3, $4) RETURNING *", [username, password, email, selectedAvatar]);
        response.status(201).send(user[0]);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error creating user", error);
            response
                .status(500)
                .send("Error while creating a new user:" + error.message);
        }
        console.error("Error creating user", error);
        response.status(500).send("Error while creating a new user");
    }
}));
// hämta användare (baserat på id)
app.get("/user/:id", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = request.params.id;
        const { rows: user } = yield client.query("SELECT * FROM users WHERE id=$1", [id]);
        if (user.length === 0)
            response.status(404).send("User not found");
        response.send(user[0]);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("An error occurred while retrieving the user:", error.message);
            response
                .status(500)
                .send("An error occurred while retrieving the user:" + error.message);
        }
        else {
            console.error("An error occurred while retrieving the user:", error);
            response.status(500).send("An error occurred while retrieving the userS");
        }
    }
}));
// hämta alla avatarer
app.get("/avatars", (_request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rows: avatar } = yield client.query("SELECT * FROM avatars");
        response.send(avatar);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("An error occurred while retrieving avatars:", error.message);
            response
                .status(500)
                .send("An error occurred while retrieving avatars: " + error.message);
        }
        else {
            console.error("An unknown error occurred:", error);
            response.status(500).send("An unknown error occurred");
        }
    }
}));
//hämta specifik avatar kopplat till användaren
app.get("/avatars/:id", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const avatarId = request.params.id;
        const { rows: avatar } = yield client.query("SELECT avatar FROM avatars WHERE id=$1", [avatarId]);
        response.send(avatar[0]);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("An error occurred while retrieving user avatar:", error.message);
            response
                .status(500)
                .send("An error occurred while retrieving user avatar: " + error.message);
        }
        else {
            console.error("An unknown error occurred:", error);
            response.status(500).send("An unknown error occurred");
        }
    }
}));
//-----------------Borsta tänderna-------------------
// lägg till ett värde för varje gång man har borstat tänderna
app.post("/brushing/:id", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = request.params.id;
        const brushingSession = yield client.query("INSERT INTO brushing_tracker (user_id) VALUES ($1)", [userId]);
        if (brushingSession.rowCount === 0) {
            response.status(500).send("Could not insert into database");
        }
        const { rows: brushingSessionUser } = yield client.query("SELECT * FROM brushing_tracker WHERE user_id=$1", [
            userId,
        ]);
        response.send(brushingSessionUser);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("An error occurred while processing the brushing session:", error.message);
            response
                .status(500)
                .send("An error occurred while processing the brushing session: " +
                    error.message);
        }
        else {
            console.error("An unknown error occurred:", error);
            response.status(500).send("An unknown error occurred");
        }
    }
}));
//hämta alla tandborsts-sessioner per användare
app.get("/brushing-sessions/:id", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = request.params.id;
        const { rows: brushingSession } = yield client.query("SELECT * FROM brushing_tracker WHERE user_id=$1", [
            userId,
        ]);
        response.send(brushingSession);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("An error occurred while retrieving the brushing session:", error.message);
            response
                .status(500)
                .send("An error occurred while retrieving the brushing session: " +
                    error.message);
        }
        else {
            console.error("An unknown error occurred:", error);
            response.status(500).send("An unknown error occurred");
        }
    }
}));
const StartServer = () => __awaiter(void 0, void 0, void 0, function* () {
    yield client.connect();
    app.listen(port, () => {
        console.log(`Redo på Port http://localhost:${port}/`);
    });
});
StartServer();
