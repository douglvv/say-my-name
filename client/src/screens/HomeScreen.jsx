import React, { useEffect, useState, useContext } from "react";
import { SocketContext } from "../contexts/SocketContext";
import { InputGroup, Form, Button, Col, Row } from "react-bootstrap";
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
        <div className="d-flex justify-content-center align-items-center vh-100">
            {/* <Container fluid="sm" > */}
            <Row sm={1} className="menu-container m-3 p-3">
                <Col >
                    <h1 className="title">Say my Name</h1>
                    <Form>
                        <Form.Group className="mb-3" controlId="username">
                            <Form.Control
                                type="text"
                                placeholder="Username"
                                required={true}
                                maxLength={20}
                                value={username}
                                size="lg"
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </Form.Group>

                        <div className="d-grid mb-3">
                            <Button onClick={createGame} variant="primary" type="submit" size="lg">
                                Create new game
                            </Button>
                        </div>

                    </Form>
                    <Form>
                        <InputGroup className="mb-3" controlId="gameId">
                            <Form.Control
                                type="text"
                                placeholder="Enter game id"
                                required={true}
                                size="lg"
                                value={gameId}
                                onChange={(e) => setGameId(e.target.value)}
                                aria-label="Recipient's username"
                                aria-describedby="basic-addon2"
                            />
                            <Button onClick={joinGame} variant="primary" type="button">
                                Join existing game
                            </Button>
                        </InputGroup>
                    </Form>
                    {isConnected
                        ? <p className="text-end small text-success">Connection to socket.io server successful</p>
                        : <p className="text-end small text-danger">Connection to socket.io server failed</p>
                    }
                </Col>
            </Row>
            {/* </Container> */}
        </div>
    );
};

// TODO: error messages


export default HomeScreen;