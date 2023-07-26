import { useContext } from "react";
import { Row, Col, Button } from "react-bootstrap"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../../contexts/SocketContext";


const GameFinishedButtons = () => {
    const gameState = useSelector((state) => state.game.game);
    const playerState = useSelector((state) => state.game.player);
    const navigate = useNavigate();
    const socket = useContext(SocketContext);

    const playAgain = () => {
        socket.emit("playAgain", { gameId: gameState.id })
    }

    const quit = () => {
        socket.emit("quit", { gameId: gameState.id })

        navigate('/');
    }

    return (
        <Row className="my-3 mx-1">
            <Col>
                <Button
                    className="w-100 py-3 px-0"
                    variant="primary"
                    disabled={!playerState.isTurn}
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