require("dotenv").config();

const app = require("./server/app");

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`)
    console.log("Press Ctrl + C to stop the server");
})

process.on("SIGTERM",()=>{
    console.log("SIGTERM received, shutting down gracefully...");
    server.close(()=>{
        console.log("Server closed. Exiting process.");
        process.exit(0);
    })
})