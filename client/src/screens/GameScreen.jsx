import { useContext, useEffect, useState } from "react";
import Scoreboard from "../components/Scoreboard/Scoreboard";
import Quote from "../components/Quote/Quote";
import AnswerOptions from "../components/AnswerOptions/AnswerOptions";
import { useParams } from "react-router-dom";
import { SocketContext } from "../contexts/SocketContext";
import { useDispatch, useSelector } from "react-redux";
import { updateGameState, updatePlayerState } from "../redux/gameSlice";
import { Container } from 'react-bootstrap'

export default function GameScreen() {
    const { gameId } = useParams();
    const gameState = useSelector((state) => state.game.game);
    const playerState = useSelector((state) => state.game.player);
    const dispatch = useDispatch();
    const socket = useContext(SocketContext);
    const [hasGameStarted, setHasGameStarted] = useState(false);

    useEffect(() => {
        const handleJoinGame = (data) => {
            const updatedGame = data;
            dispatch(updateGameState({ game: updatedGame }));
        }
        const handleUpdateGame = (data) => {
            const updatedGame = data;

            console.log(updatedGame);

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
        if (
            gameState.players.length === 2 &&
            playerState.isTurn &&
            hasGameStarted === false
        ) {
            socket.emit("startGame", { gameId: gameId });
            console.log(`${playerState.id} message sent: start`);
        }
    }, [gameId, gameState.players.length, hasGameStarted, playerState.id, playerState.isTurn, socket])

    return (
        <>
            <Container className="vh-100">
                {hasGameStarted ? (
                    <>
                        <Scoreboard />
                        <Quote />
                        <AnswerOptions />
                    </>

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