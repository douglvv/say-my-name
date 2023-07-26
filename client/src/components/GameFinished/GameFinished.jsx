import { Col, Row, Stack } from "react-bootstrap";
import styles from './styles.module.css';
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

const GameFinished = () => {
    const gameState = useSelector((state) => state.game.game);
    const [player1, setPlayer1] = useState({});
    const [player2, setPlayer2] = useState({});
    const [gameResult, setGameResult] = useState("");

    const checkResult = (player1, player2) => {
        if (player1.points === player2.points) return setGameResult("It's a draw!");
        else if (player1.points > player2.points) return setGameResult(`${player1.username} won!`);
        else return setGameResult(`${player2.username} won!`);
    };

    useEffect(() => {
        setPlayer1(gameState.players[0]);
        setPlayer2(gameState.players[1]);

        checkResult(player1, player2);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <div className="justify-content-between m-3">
            <Row className="mb-3">
                <Col className={`mx-2 p-2 ${styles.wrapper}`}>
                    <Stack>
                        <h4 className="username">Game Finished</h4>
                        <h2>{gameResult}</h2>
                    </Stack>
                </Col>
            </Row>
            <Row className="mb-3">
                <Col className={`mx-2 p-2 ${styles.wrapper}`}>
                    <Stack>
                        <h4>{player1.username}</h4>
                        <h5>{player1.points} points</h5>
                    </Stack>
                </Col>
                <Col className={`mx-2 p-2 ${styles.wrapper}`}>
                    <Stack>
                        <h4>{player2.username}</h4>
                        <h5>{player2.points} points</h5>
                    </Stack>
                </Col>
            </Row>
        </div>
    )
}

export default GameFinished;