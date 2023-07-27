import { useContext, useEffect } from "react";
import { Row, Col, Button } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../../contexts/SocketContext";
import { updateGameState, updatePlayerState } from "../../redux/gameSlice";

const GameFinishedButtons = () => {
    const gameState = useSelector((state) => state.game.game);
    const playerState = useSelector((state) => state.game.player);
    const navigate = useNavigate();
    const socket = useContext(SocketContext);
    const dispatch = useDispatch();

    const playAgain = () => {
        socket.emit("playAgain", { gameId: gameState.id })
    }

    const quit = () => {
        socket.emit("quitGame", { gameId: gameState.id })
    }

    useEffect(() => {
        const handleQuit = (data) => {
            const {game, playerId} = data;

            if(playerId === playerState.id) return navigate('/');

            dispatch(updateGameState({game: game}));
            dispatch(updatePlayerState({player: game.players[0]}))
            navigate(`/game/${game.id}`);           
        }
        socket.on("quitGame", handleQuit)

        const handlePlayAgain = (data) => {
            const game = data;

            game.players.forEach((player) => {
                if (player.id == playerState.id) dispatch(updatePlayerState({ player: player }));
            })

            dispatch(updateGameState({ game: game }));

            navigate(`/game/${game.id}`);
        }
        socket.on("playAgain", handlePlayAgain);

        return(() => {
            socket.off("quitGame", handleQuit);
            socket.off("playAgain", handlePlayAgain);
        })
    }, [socket, navigate, dispatch, playerState.id, gameState.id])

    return (
        <Row className="my-3 mx-1">
            <Col>
                <Button
                    className="w-100 py-3 px-0"
                    variant="primary"
                    disabled={playerState.isTurn}
                    onClick={playAgain}
                >
                    Play Again
                </Button>
            </Col>
            <Col>
                <Button
                    className="w-100 py-3 px-0"
                    variant="danger"
                    disabled={false}
                    onClick={quit}
                >
                    Quit
                </Button>
            </Col>
        </Row>
    )
}

export default GameFinishedButtons;