import React, { useEffect, useState, useContext } from "react";
import { SocketContext } from "../contexts/SocketContext";
import { Container, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const HomeScreen = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [username, setUsername] = useState("")
    const socket = useContext(SocketContext);
    const navigate = useNavigate();

    function createGame(e) {
        e.preventDefault()

        try {
            socket.emit("createGame", {username: username});
        } catch (error) {
            console.log(error.message);
        }
    }

    useEffect(() => {
        const handleConnection = () => {
            setIsConnected(true);
        };
        socket.on("connection", handleConnection);

        const handleCreateGame = (data) => {
            console.log(data)
            const game = data;

            localStorage.setItem("game", JSON.stringify(game));
            navigate(`/game/${game.id}`);
        }
        socket.on("createGame", (data) => {
            handleCreateGame(data);
        })

        return () => {
            socket.off("connection", handleConnection);
            socket.off("createGame", handleCreateGame);
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
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </Form.Group>

                <Button onClick={createGame} variant="primary" type="submit">
                    Create new game
                </Button>
            </Form>
        </Container>
    );
};

// join game
// handle join
// error messages


export default HomeScreen;