import { useContext, useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { SocketContext } from "../contexts/SocketContext";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateGameState, updatePlayerState } from '../redux/gameSlice';

export default function CreateGameForm() {
    const [username, setUsername] = useState("");
    const [error, setError] = useState(false);
    const socket = useContext(SocketContext);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const playerState = useSelector((state) => state.game.player);

    function createGame(e) {
        e.preventDefault()

        setError(false);

        if(!username.trim()) {
            setError(true);
            return
        }

        socket.emit("createGame", { username });
    }

    useEffect(() => {
        const handleCreateGame = (data) => {
            const game = data;

            game.players.map((player) => {
                if (player.id == playerState.id) { dispatch(updatePlayerState({ player: player })) }
            });

            navigate(`/game/${game.id}`);
            dispatch(updateGameState({ game }));
        };
        socket.on("createGame", handleCreateGame);

        return () => {
            socket.off("createGame", handleCreateGame);
        }
    }, [socket, navigate, dispatch, playerState])

    return (
        <>
            <Form>
                <Form.Group className="mb-3" controlId="username">
                    <Form.Control
                        type="text"
                        placeholder="Username*"
                        required={true}
                        maxLength={12}
                        value={username}
                        size="lg"
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    {error && <p className="text-start small">Username required</p>}
                </Form.Group>

                <div className="d-grid mb-3">
                    <Button onClick={createGame} variant="primary" type="submit" size="lg">
                        Create new game
                    </Button>
                </div>

            </Form>
        </>
    );
}