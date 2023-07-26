import { useSelector } from "react-redux";
import { Button, Row, Col } from "react-bootstrap";
import { SocketContext } from "../../contexts/SocketContext";
import { useContext, useEffect, useState } from "react";
import { Store as notification } from "react-notifications-component";


const notificationPreset = {
    title: "",
    message: "",
    type: "success",
    insert: "top",
    container: "top-center",
    animationIn: ["animate__animated", "animate__fadeIn"],
    animationOut: ["animate__animated", "animate__fadeOut"],
    dismiss: {
        duration: 3000,
        onScreen: true
    }
}

const AnswerOptions = () => {
    const gameState = useSelector(state => state.game.game);
    const playerState = useSelector(state => state.game.player);
    const [buttonsDisabled, setButtonsDisabled] = useState(!playerState.isTurn);
    const socket = useContext(SocketContext);

    function sendAnswer(option) {
        setButtonsDisabled(true);

        if (option === gameState.quote.answer) {
            notification.addNotification({
                ...notificationPreset,
                title: "Correct! +100",
                message: `The answer is ${gameState.quote.answer}`
            });
        }
        else {
            notification.addNotification({
                ...notificationPreset,
                title: "Wrong!",
                message: `The answer is ${gameState.quote.answer}`,
                type: "danger"
            });
        }

        setTimeout(() => {
            socket.emit("answer", {
                answer: option,
                playerId: playerState.id,
                gameId: gameState.id
            });
        }, 3000);
    }

    useEffect(() => {
        setButtonsDisabled(!playerState.isTurn);
    }, [playerState]);

    return (
        <>
            <Row className="my-3 mx-1">
                {gameState.quote.answerOptions.map((option, i) => (
                    <Col key={i}>
                        <Button
                            className="w-100 py-3 px-0"
                            variant="primary"
                            disabled={buttonsDisabled}
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
