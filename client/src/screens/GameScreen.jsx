import React, { useContext, useEffect, useState } from "react";
import Scoreboard from "../components/Scoreboard/Scoreboard";
import { useParams } from "react-router-dom";
import { SocketContext } from "../contexts/SocketContext";
import { useDispatch, useSelector } from "react-redux";
import { updateGameState, finishGame, updatePlayerState } from "../redux/gameSlice";
import { Container, Row, Col, Badge, Card } from 'react-bootstrap'

export default function GameScreen() {
    const { gameId } = useParams();
    const gameState = useSelector((state) => state.game.game);
    const playerState = useSelector((state) => state.game.player);
    const dispatch = useDispatch();
    const socket = useContext(SocketContext);
    const [hasGameStarted, setHasGameStarted] = useState(false);


    function startGame() {
        if (
            gameState.players.length === 2 &&
            playerState.isTurn &&
            hasGameStarted === false
        ) {
            socket.emit("startGame", { gameId: gameId });
            console.log(`${playerState.id} message sent: start`);
        }
    }

    useEffect(() => {
        const handleJoinGame = (data) => {
            const updatedGame = data;
            dispatch(updateGameState({ game: updatedGame }));
        }
        const handleUpdateGame = (data) => {
            const updatedGame = data;

            updatedGame.players.forEach((player) => {
                if (player.id == playerState.id) dispatch(updatePlayerState({ player: player }));
            })

            dispatch(updateGameState({ game: updatedGame }));
        }
        const handleStartGame = () => {
            setHasGameStarted(true);
        };

        socket.on("joinGame", handleJoinGame);
        socket.on("update", handleUpdateGame);
        socket.on("startGame", handleStartGame);

        return (() => {
            socket.off("joinGame", handleJoinGame)
            socket.off("update", handleUpdateGame);
            socket.off("startGame", handleStartGame);
        })
    }, [socket, dispatch, gameId, gameState, playerState])

    useEffect(() => {
        startGame();
    }, [gameState.players.length])

    return (
        <>
            <Container className="">
                {hasGameStarted ? (
                    <Scoreboard />
                    // <div className="justify-content-between m-3">
                    //     <Row sm={1}>
                    //         <Col sm={4} className="text-center p-2">
                    //             <h2 className="username">{gameState.players[0].username}</h2>
                    //         </Col>
                    //         <Col sm={4} className="text-center p-2">
                    //             {gameState.players.map((player) => (
                    //                 player.isTurn ?
                    //                     <h4 key={player.id}> {player.username}'s turn</h4> :
                    //                     null
                    //             ))}
                    //         </Col>
                    //         <Col sm={4} className="text-center p-2">
                    //             <h2 className="username">{gameState.players[1].username}</h2>
                    //         </Col>
                    //     </Row>
                    // </div>
                ) : (
                    <ul>
                        {gameState.players.map((player) => (
                            <li key={player.id}>
                                <p>{player.username} connected.</p>
                            </li>
                        ))}
                    </ul>
                )}
            </Container>


        </>
    )
}