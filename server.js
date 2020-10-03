const express = require("express"); // importing a CommonJS module
const morgan = require("morgan"); // remember to npm i morgan

const hubsRouter = require("./hubs/hubs-router.js");

const server = express();

const logger = morgan("combined"); // 'combined' chooses a pre-made format for the logs

// global middleware
function greeter(req, res, next) {
    console.log("hello");

    req.name = "sam";

    next();
}

// write and use middleware that will read a password from the headers, if the password is 'mellon' let the request continue.
// for any other password, or no password at all, respond with http status 401 and a message
function passCheck(req, res, next) {
    if (req.headers.password === "mellon") {
        next();
    } else {
        res.status(401).json({ errorMessage: "Inccorect password" });
    }
}

server.use(express.json()); // built-in
server.use(logger);
server.use(greeter);
// server.use(passCheck);

server.get("/", (req, res) => {
    const password = req.headers.password;

    const nameInsert = req.name ? `${req.name}` : "unknown";

    res.status(200).json({ name: nameInsert, password });
});

// endpoints
server.use("/api/hubs", passCheck, hubsRouter);

module.exports = server;
