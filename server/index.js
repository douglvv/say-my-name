const express = require('express');
const { createServer } = require("http");
const { Server } = require("socket.io");
const axios = require("axios");
const cors = require("cors");
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

io.on("connection", (socket) => {
    console.log(`socket ${socket.id} connected.`);
    socket.emit("connection", { id: socket.id });

    socket.on("createGame", (data) => {        
        const gameId = generateId();
        socket.join(gameId);
        const gameRoom = io.sockets.adapter.rooms.get(gameId);

        const game = {
            id: gameId,
            players: [],
            quote: {},
            quoteHistory: [],
            quotesLeft: 20,
        }

        const player1 = {
            id: socket.id,
            username: data.username,
            points: 0,
            isTurn: true
        }

        game.players.push(player1);

        gameRoom.game = game;

        socket.emit("createGame", game);
    })
})

function generateId() {
    return uuidv4();
}

const PORT = 3000;
server.listen(PORT, () => {
    console.log("server listening on localhost:", PORT);
})

