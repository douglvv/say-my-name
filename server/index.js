const express = require('express');
const { createServer } = require("http");
const { Server } = require("socket.io");
const axios = require("axios");
const cors = require("cors");
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = createServer(app);
const io = require("socket.io")(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

io.on("connection", (socket) => {
    console.log(`socket ${socket.id} connected.`);
    socket.emit("connection", { id: socket.id });

    socket.on("createGame", (data) => {
        try {
            const username = data.username;

            if (!username) return socket.emit("error", { message: "No username provided." })

            const gameId = uuidv4();
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

            // socket.emit("player", player)
            socket.emit("createGame", game);
            console.log("CREATE_GAME: game:", game.id);
        } catch (error) {
            socket.emit("error", error);
        }
    })

    socket.on("joinGame", (data) => {
        try {
            const { username, gameId } = data;

            const gameRoom = io.sockets.adapter.rooms.get(gameId);

            if (!gameRoom) return socket.emit("error", { message: "Game room not found." });
            if (!username) return socket.emit("error", { message: "No username provided." });

            socket.join(gameId);

            const game = gameRoom.game;

            if (game.players.length === 2) return socket.emit("error", { message: "Game full." })

            const player = {
                id: socket.id,
                username: username,
                points: 0,
                isTurn: false // o player 2 não começa jogando
            }

            game.players.push(player);

            // socket.emit("player", player)
            io.to(gameId).emit("joinGame", game)
            console.log("JOIN_GAME: player:", player.username);
            // console.log("JOIN_GAME: game:",game);
        } catch (error) {
            socket.emit("error", { message: error.message });
        }
    })

    socket.on("startGame", async (data) => {
        try {
            // // console.log("startgame")
            const gameId = data.gameId;
            const gameRoom = io.sockets.adapter.rooms.get(gameId);
            const game = gameRoom.game;

            const quote = await fetchQuote(game);
            game.quote = quote
            game.quoteHistory.push(quote);
            game.quotesLeft--;
            // // console.log(game);

            io.to(gameId).emit("startGame");
            io.to(gameId).emit("update", game);
            console.log("game started, quote:", game.quote.quote);
        } catch (error) {
            socket.emit("error", { message: error.message });
        }
    })

    socket.on("answer", async (data) => {
        const { answer, playerId, gameId } = data
        const game = io.sockets.adapter.rooms.get(gameId).game;
        const players = game.players;

        if (isAnswerCorrect(game.quote, answer)) {
            // Adiciona 100 pontos se for a resposta correta
            players.find((player) => player.id === playerId).points += 100;
        }

        if (game.quotesLeft == 0) return io.to(gameId).emit("finish", game);

        players.forEach((player) => { player.isTurn = !player.isTurn }) // Altera os turnos

        const quote = await fetchQuote(game);
        game.quote = quote
        game.quoteHistory.push(quote);
        game.quotesLeft--;

        io.to(gameId).emit("update", game);
        console.log("newQuote: ", quote);
    })
})

async function fetchQuote(game) {
    try {
        let allAuthors = ['Walter White', 'Saul Goodman', 'Jesse Pinkman', 'Walter White Jr', 'Skyler White',
            'Gustavo Fring', 'Hank Schrader', 'Mike Ehrmantraut', 'The fly', 'Badger'];

        const response = await axios.get('https://api.breakingbadquotes.xyz/v1/quotes');
        const data = await response.data[0];

        let frase = data.quote
        let answer = data.author

        for (let i = 0; i < game.quoteHistory.length - 1; i++) { // verifica se a frase já foi usada
            if (frase == game.quoteHistory[i].quote) return fetchQuote(game);
        }

        const answerIndex = allAuthors.indexOf(answer)
        allAuthors.splice(answerIndex, 1)

        for (let i = allAuthors.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allAuthors[i], allAuthors[j]] = [allAuthors[j], allAuthors[i]];
        }

        const answerOptions = allAuthors.slice(0, 4);
        answerOptions[Math.floor(Math.random() * 4)] = answer;

        const quote = { quote: frase, answer: answer, answerOptions: answerOptions }
        return quote
    } catch (error) {
        console.log(error.message)
        return null
    }
}

/**
 * 
 * @param {Object} the game's quote object
 * @param {String} answer 
 * @returns {Boolean} true if is correct, false if is incorrect
 */
function isAnswerCorrect(quote, answer) {
    const correctAnswer = quote.answer;

    if (answer === correctAnswer) return true;
    else return false;
}

const PORT = 3001;
server.listen(PORT, () => {
    console.log("server listening on localhost:", PORT);
})

module.exports = { server, io };