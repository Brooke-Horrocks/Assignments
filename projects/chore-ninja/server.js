const express = require("express");
const app = express();
require("dotenv").config();
const morgan = require("morgan");
const mongoose = require("mongoose");
const expressJwt = require("express-jwt");
const PORT = process.env.PORT;

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", expressJwt({ secret: process.env.SECRET }));

mongoose.set("useCreateIndex", true);
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true }, () => console.log("Connected to MongoDB"));

app.use("/auth", require("./routes/auth"));
app.use("/api/chores", require("./routes/chore"));
app.use("/api/rewards", require("./routes/reward"));

// General error catching
app.use((err, req, res, next) => {
    console.log(err);
    if (err.name === "UnauthorizedError") {
        res.status(err.status)
    }
    return res.send({ message: err.message });
});

app.listen(PORT, () => {
    console.log(`[+] Starting server on port ${PORT}`);
});