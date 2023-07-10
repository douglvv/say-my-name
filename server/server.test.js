const { io } = require("socket.io-client");

describe("server", () => {
    beforeAll((done) => {
        socket = io("http://localhost:3001");
        done()
    });

    afterAll(() => {
        socket.close();
    })

    test("deve conectar", () => {
        socket.on("connection", (data) => {
            expect(data).toBeDefined();
            expect(data.id).toBe(socket.id);
        });
    });

    test("deve criar um jogo", () => {
        socket.emit("createGame", {username: "modafoker"})
        
        socket.on("createGame", (game) => {
            expect(game).toBeDefined();
            expect(game.players).toHaveLength(1);
            expect(game.players[0].username).toBe("modafoker")
        });  
    });
});