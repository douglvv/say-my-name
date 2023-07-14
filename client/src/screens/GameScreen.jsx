import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SocketContext } from "../contexts/SocketContext";
import { useDispatch, useSelector } from "react-redux";
import { updateGameState, finishGame, updatePlayerState } from "../redux/gameSlice";

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
            <h1>Game Screen</h1>
            <h4>Game: {gameId}</h4>



            {hasGameStarted ? (
                <div id="game">
                    <h4>{gameState.players[0].username} | {gameState.players[0].points} points</h4>
                    <h4>{gameState.players[1].username} | {gameState.players[1].points} points</h4>

                    <h3>{gameState.quote.quote}</h3>
                    <ul>
                        {gameState.quote.answerOptions && gameState.quote.answerOptions.length > 0 && (
                            gameState.quote.answerOptions.map((option, index) => (
                                <li key={index}>
                                    <p>{option}</p>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            ) : (
                <ul>
                    {gameState.players.map((player) => (
                        <li key={player.id}>
                            <p>{player.username} connected.</p>
                        </li>
                    ))}
                </ul>
            )}


            <br />
            <hr />
        </>
    )
}