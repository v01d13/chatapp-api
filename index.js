// Importing modules
const express = require("express");
const app = express();
const https = require("http").Server(app);
const socketio = require("socket.io")(https);
const enforce = require("express-sslify");
const sql = require("mssql");
const registration_and_login = require("./registration_and_login");
const md5 = require("md5");
const User = require("./models/user");
const {poolFunction} = require("./db_operations");
const error_handlers = require("./error_handlers");

const startServer = async () => {
    poolFunction();
    app.use(
        express.urlencoded({
            extended: true,
        })
    );
    app.use(express.json());
    app.get("/", (req, res) => {
        res.send("Https test!!");
    });

    app.post(
        "/signup",
        error_handlers(async (req, res) => {
            console.log("we are at top of post request");
            // try{
            const userName = req.body.userName;
            const email = req.body.email;
            const dob = req.body.dob;
            const gender = req.body.gender;
            const userPassword = req.body.userPassword;
            if (!userName || !email || !dob || !gender || !userPassword)
                throw "Fill up all the fields";
            const password = md5(userPassword);
            let newUser = new User(userName, email, dob, gender, password);
            var finalResult = await registration_and_login.registration(newUser);
            if (finalResult == 1) {
                res.json({
                    success: 1,
                    message: "Your account is successfully created",
                });
            }
        })
    );
    app.post(
        "/login",
        error_handlers(async (req, res, next) => {
            const userName = req.body.userName;
            const userPassword = req.body.userPassword;
            const password = md5(userPassword);
            var finalResult = await registration_and_login.login(userName, password);
            if (finalResult == 1) {
                res.json({
                    success: 1,
                    message: "Login Successful",
                });
            }
        })
    );

    app.use(enforce.HTTPS());

    // Socket connection on connected
    socketio.on("connection", (user, socket) => {
        console.log(`${socket.sid} connected`);
    });
    // Socket connection error
    socketio.on("clientError", (err, socket) => {
        console.error(err);
        socketio.end("HTTP/1.1 400 Bad Request\r\n\r\n");
    });
    // Socket on disconnect
    socketio.on("disconnect", (client) => {
        socketio[client].disconnect();
        console.log(`User disconnected`);
    });
    // HTTPS server
    https.listen(process.env.PORT || 5000, (req, res) => {
        console.log("Listening: ", https.address());
    });
    socketio.on("send_message", async (data) => {
        await sql.query(
            `insert into message (message,toUser,fromUser) values (${data.message}, ${data.toUser}, ${data.fromUser})`
        );
        console.log(data.toUser);
        console.log(data.message);
    });
    // Private message for future//
    socketio.on("private_message", async (username) => {
        const query_result = await sql.query(
            `select * from message where toUser = ${username}`
        );
        console.log(query_result);
    });
};

async function login(req, res) {
    const username = req.body.username;
    const user = {name: username};
    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
    refreshTokens.push(refreshToken);
    await res.json({accessToken: accessToken, refreshToken: refreshToken});
};

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15000s'});
}

async function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    try {
        const decoded = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded;
        next();
    }finally{

    }
}

startServer();
