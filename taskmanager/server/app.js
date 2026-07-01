const express = require("express");
const path = require("path");
const helmet = require("helmet");
const cors = require("cors");

const taskRoutes = require('./routes/taskRoutes');

const { initialiseDatabase } = require('./config/database');

const app = express();

initialiseDatabase();

app.use(helmet());

app.use(cors({
    origin:process.env.NODE_ENV ==="production" ? process.env.ALLOWED_ORIGIN : "*",
    methods:["GET","POST","PUT","DELETE"],
}))

app.use(express.json());

app.use(express.urlencoded({ extended: false}));

app.use(express.static(path.join(__dirname,'..','public')));

app.use('/api',taskRoutes);

app.use((req,res)=>{
    res.status(404).json({error:"Route Not Found"});
})

app.use((err,req,res,next)=>{
    console.log("UnhandledError:", err.stack);

    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({error: process.env.NODE_ENV === "production" ? "Internal Server Error" : err.message});
})

module.exports = app;