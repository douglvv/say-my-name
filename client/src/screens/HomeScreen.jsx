import React, { useEffect, useState, useContext } from "react";
import { SocketContext } from "../contexts/SocketContext";
import { Container, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux'
import { updateGameState, updatePlayerState, setPlayerId } from '../redux/gameSlice';

const HomeScreen = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [username, setUsername] = useState("")
    const [gameId, setGameId] = useState("");
    const socket = useContext(SocketContext);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const playerState = useSelector((state) => state.game.player);

    function createGame(e) {
        e.preventDefault()

        socket.emit("createGame", { username });
    }

    function joinGame(e) {
        e.preventDefault()

        socket.emit("joinGame", { username, gameId });
    }

    useEffect(() => {
        // Connection
        const handleConnection = (data) => {
            const id = data.id;

            setIsConnected(true);
            dispatch(setPlayerId({ id: id }));
        };
        socket.on("connection", handleConnection);

        // Create game
        const handleCreateGame = (data) => {
            const game = data;

            game.players.map((player) => {
                if (player.id == playerState.id) { dispatch(updatePlayerState({ player: player })) };
            });

            navigate(`/game/${game.id}`);
            dispatch(updateGameState({ game }));
        };
        socket.on("createGame", handleCreateGame);

        // // Update player
        // const handleUpdatePlayer = (data) => {
        //     const player = data;

        //     localStorage.setItem("player", JSON.stringify(player));
        //     dispatch(updatePlayerState(player));
        // }
        // socket.on("player", handleUpdatePlayer);

        // Join game
        const handleJoinGame = (data) => {
            const game = data;

            game.players.map((player) => {
                if (player.id == playerState.id) { dispatch(updatePlayerState({ player: player })) };
            })

            navigate(`/game/${game.id}`);
            dispatch(updateGameState({ game }));
        }
        socket.on("joinGame", handleJoinGame);


        return () => {
            socket.off("connection", handleConnection);
            socket.off("createGame", handleCreateGame);
            socket.off("joinGame", handleJoinGame);
            // socket.off("player", handleUpdatePlayer);
        };
    }, [socket, navigate, gameId, dispatch, playerState]);


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

                <Button onClick={createGame} variant="primary" type="button">
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

                <Button onClick={joinGame} variant="primary" type="button">
                    Join existing game
                </Button>
            </Form>
        </Container>
    );
};

// TODO: error messages


export default HomeScreen;