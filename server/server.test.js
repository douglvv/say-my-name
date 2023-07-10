const { io } = require("socket.io-client");

describe("server", () => {
    let socket;
    let socket2;
    let socket3;
    let gameId;

    beforeAll((done) => {
        socket = io("http://localhost:3001");
        socket.on("connection", () => {
            done();
        });
    });

    afterAll(() => {
        socket.close();
        socket2.close();
        socket3.close()
    })

    // socket connection
    test("deve conectar", () => {
        socket.on("connection", (data) => {
            expect(data).toBeDefined();
            expect(data.id).toBe(socket.id);
        });
    });

    // createGame
    test("deve criar um jogo", () => {
        socket.emit("createGame", { username: "modafoker" });

        socket.on("createGame", (game) => {
            gameId = game.id;
            expect(game).toBeDefined();
            expect(game.players).toHaveLength(1);
            expect(game.players[0].username).toBe("modafoker");
        });
    });

    // create game error
    test("deve receber um erro de no username provided", () => {
        socket.emit("createGame", { username: null });

        socket.on("error", (error) => {
            expect(error).toBeDefined();
            expect(error.message).toBe("No username provided.");
        });
    });

    // socket 2 connection
    test("socket 2 deve conectar", () => {
        socket2 = io("http://localhost:3001");
        socket2.on("connection", () => {
            socket2.emit("joinGame", { username: "jaspion", gameId: gameId });
        });
    });

    // joinGame
    test("socket 2 deve joinar o jogo", () => {
        socket2.on("joinGame", (game) => {
            expect(game).toBeDefined();
            expect(game.players).toHaveLength(2);
            expect(game.players[1].username).toBe("jaspion");
        });
    })

    // socket 3 connection
    test("socket 3 deve conectar", () => {
        socket3 = io("http://localhost:3001");
        socket3.on("connection", () => {
            socket3.emit("joinGame", { username: "ljkasdjklasd", gameId: gameId });
        });
    });

    // error game full
    test("deve receber um erro de game full", () => {
        socket2.on("error", (error) => {
            expect(error).toBeDefined();
            expect(error.message).toBe("Game full.");            
        });
    })
});
