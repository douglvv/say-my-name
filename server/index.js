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
        try {
            const username = data.username;

            if(!username) return socket.emit("error", { error: { message: "No username provided." } })

            const gameId = generateId();
            socket.join(gameId);

            const game = {
                id: gameId,
                players: [],
                quote: {},
                quoteHistory: [],
                quotesLeft: 20,
            }

            const player = {
                id: socket.id,
                username: username,
                points: 0,
                isTurn: true // o criador da sala começa jogando
            }

            game.players.push(player);
            const gameRoom = io.sockets.adapter.rooms.get(gameId);
            gameRoom.game = game;

            socket.emit("createGame", game);
            console.log(`game ${gameId} created.`);
            console.log(`player ${player.username} joined the game.`)
        } catch (error) {
            socket.emmit("error", error);
        }
    })

    socket.on("joinGame", (data) => {
        try {
            const { username, gameId } = data;
            const gameRoom = io.sockets.adapter.rooms.get(gameId);

            if (!gameRoom) return socket.emit("error", { error: { message: "Game room not found;" } });

            const game = gameRoom.game;

            if (game.players.length  === 2) return socket.emit("error", { error: { message: "Game full." } });

            const player = {
                id: socket.id,
                username: username,
                points: 0,
                isTurn: false // o player 2 não começa jogando
            }

            game.players.push(player);

            socket.to(gameId).emit("joinGame", game)
            console.log(`player ${player.username} joined the game.`)
        } catch (error) {
            socket.emmit("error", error)
        }
    })
})

function generateId() {
    return uuidv4();
}

const PORT = 3001;
server.listen(PORT, () => {
    console.log("server listening on localhost:", PORT);
})

module.exports = { server, io };