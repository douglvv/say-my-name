import React from "react";
import styles from './styles.module.css'
import { Row, Col, Stack, Badge } from "react-bootstrap";
import { useSelector } from "react-redux";

const Scoreboard = () => {
    const gameState = useSelector((state) => state.game.game);

    return (
        <div className="justify-content-between m-3">
            <Row >
                <Col className={`text-center p-2 mx-2 ${styles.playerWrapper}`}>
                    <Stack>
                        <h4 className="username">{gameState.players[0].username}</h4>
                        <h5>{gameState.players[0].points} points</h5>
                    </Stack>
                </Col>
                <Col className={`text-center p-2 mx-2 ${styles.turnInfoWrapper}`}>
                    <Stack>
                        <h4>Quote {(20 - gameState.quotesLeft)}/20</h4>
                        {
                            gameState.players.map((player) => (
                                player.isTurn ?
                                    <h4 key={player.id}> {player.username}'s turn</h4> :
                                    null
                            ))
                        }
                    </Stack>
                </Col>
                <Col className={`text-center p-2 mx-2 ${styles.playerWrapper}`}>
                    <Stack>
                        <h4 className="username">{gameState.players[1].username}</h4>
                        <h5>{gameState.players[1].points} points</h5>
                    </Stack>
                </Col>
            </Row>
        </div>
    );
};

export default Scoreboard;
