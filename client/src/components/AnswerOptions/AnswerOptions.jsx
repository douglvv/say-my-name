import React from "react";
import { useSelector } from "react-redux";
import { Button, Row, Col } from "react-bootstrap";


// TODO: arrumar essa parte - não popula os botoes ao iniciar o jogo
// e dps q atualiza no vscode faz 3 requisiçoes de startGame
const AnswerOptions = () => {
    const gameState = useSelector(state => state.game.game);

    return (
        <>
           { gameState.quote &&  <Row>
                {gameState.quote.answerOptions.map((option) => {
                    <Col>
                        <Button variant="primary" value={option}>{option}</Button>
                    </Col>
                })}
            </Row>}
        </>
    )
};

export default AnswerOptions;