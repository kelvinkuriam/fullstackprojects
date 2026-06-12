require('dotenv').config();

const express = require("express");

const app = express();


const PORT = process.env.PORT || 3000;

app.get("/",(req,res)=>{
    res.json({
        message:"Welcome to the Task Manager API",
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
    })
})

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
    console.log(`Press Ctrl+C to stop the server`);
});