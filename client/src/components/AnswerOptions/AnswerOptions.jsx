import { useSelector } from "react-redux";
import { Button, Row, Col } from "react-bootstrap";
import { SocketContext } from "../../contexts/SocketContext";
import { useContext } from "react";

const AnswerOptions = () => {
    const gameState = useSelector(state => state.game.game);
    const playerState = useSelector(state => state.game.player);
    const socket = useContext(SocketContext);

    function sendAnswer(option) {
        socket.emit("answer", {
            answer: option,
            playerId: playerState.id,
            gameId: gameState.id
        });
    }

    return (
        <>
            <Row className="my-3 mx-1">
                {gameState.quote.answerOptions.map((option, i) => (
                    <Col key={i}>
                        <Button
                            className="w-100 py-3 px-0"
                            variant="primary"
                            disabled={playerState.isTurn}
                            value={option}
                            onClick={(e) => sendAnswer(e.target.value)}
                        >
                            {option}
                        </Button>
                    </Col>
                ))}
            </Row>
        </>
    )
};

export default AnswerOptions;
