import { useContext, useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { SocketContext } from "../contexts/SocketContext";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateGameState, updatePlayerState } from '../redux/gameSlice';

export default function JoinGameForm() {
    const [gameId, setGameId] = useState("");
    const [username, setUsername] = useState("");
    const socket = useContext(SocketContext);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const playerState = useSelector((state) => state.game.player);

    function joinGame(e) {
        e.preventDefault()

        socket.emit("joinGame", { username, gameId });
        console.log("joined");
    }

    useEffect(() => {
        const handleJoinGame = (data) => {
            const game = data;

            game.players.map((player) => {
                if (player.id == playerState.id) { dispatch(updatePlayerState({ player: player })) }
            });

            navigate(`/game/${game.id}`);
            dispatch(updateGameState({ game }));
        }
        socket.on("joinGame", handleJoinGame);

        return () => {
            socket.off("joinGame", handleJoinGame);
        }
    }, [socket, navigate, dispatch, playerState]);

    return (
        <>
            <Form>
                <Form.Group className="mb-3" controlId="username">
                    <Form.Control
                        type="text"
                        placeholder="Username*"
                        required
                        maxLength={10}
                        value={username}
                        size="lg"
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="username">
                    <Form.Control
                        type="text"
                        placeholder="Game ID*"
                        required
                        value={gameId}
                        size="lg"
                        onChange={(e) => setGameId(e.target.value)}
                    />
                </Form.Group>

                <div className="d-grid mb-3">
                    <Button onClick={joinGame} variant="primary" type="submit" size="lg">
                        Join game
                    </Button>
                </div>
            </Form >
        </>
    );
}
