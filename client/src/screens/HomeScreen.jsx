import React, { useEffect, useState, useContext } from "react";
import { SocketContext } from "../contexts/SocketContext";
import { Container, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux'
import { updateGameState } from '../redux/gameSlice';

const HomeScreen = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [username, setUsername] = useState("")
    const [gameId, setGameId] = useState("");
    const socket = useContext(SocketContext);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    function createGame(e) {
        e.preventDefault()

        try {
            socket.emit("createGame", { username: username });
        } catch (error) {
            console.log(error.message);
        }
    }

    function joinGame(e) {
        e.preventDefault()

        socket.emit("joinGame", {username: username, gameId: gameId});
    }

    useEffect(() => {
        // Connection
        const handleConnection = () => {
            setIsConnected(true);
        };
        socket.on("connection", handleConnection);

        // Create game
        const handleCreateGame = (data) => {
            console.log(data)
            const game = data;

            localStorage.setItem("game", JSON.stringify(game));
            dispatch(updateGameState({game: game}));
            
            navigate(`/game/${game.id}`);
        };
        socket.on("createGame", (data) => {
            handleCreateGame(data);
        });

        // Join game
        const handleJoinGame = (data) => {
            console.log(data)
            const game = data;

            localStorage.setItem("game", JSON.stringify(game));
            dispatch(updateGameState({game: game}));
            
            navigate(`game/${gameId}`);            
        }
        socket.on("joinGame", (data) => {
            handleJoinGame(data);
        })

        return () => {
            socket.off("connection", handleConnection);
            socket.off("createGame", handleCreateGame);
            socket.off("joinGame", handleJoinGame);
        };
    }, [socket, navigate]);

    return (
        <Container fluid="sm">
            {isConnected ? <p>Connected to socket.io server</p> : <p>Disconnected from socket.io server</p>}
            <br />
            <Form>
                <Form.Group className="mb-3" controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter username"
                        required={true}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </Form.Group>

                <Button onClick={createGame} variant="primary" type="submit">
                    Create new game
                </Button>
            </Form>
            <br />
            <hr />
            <Form>
                <Form.Group className="mb-3" controlId="gameId">
                    <Form.Label>Game id</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter game id"
                        required={true}
                        value={gameId}
                        onChange={(e) => setGameId(e.target.value)}
                    />
                </Form.Group>

                <Button onClick={joinGame} variant="primary" type="submit">
                    Join existing game
                </Button>
            </Form>
        </Container>
    );
};

// TODO: error messages


export default HomeScreen;