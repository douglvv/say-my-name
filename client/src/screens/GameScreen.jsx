import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { SocketContext } from "../contexts/SocketContext";
import { useDispatch, useSelector } from "react-redux";
import { updateGameState, finishGame } from "../redux/gameSlice";

export default function GameScreen() {
    const { gameId } = useParams();
    const gameState = useSelector(state => state.game.game);
    const dispatch = useDispatch();
    const socket = useContext(SocketContext);

    useEffect(() => {
        // Outro jogador joina a partida
        function handleJoinGame(data) {
            const updatedGame = data;
            dispatch(updateGameState({ game: updatedGame }));
        }
        socket.on("joinGame", handleJoinGame);

        return () => {
            socket.off("joinGame", handleJoinGame);
        };
    }, [socket, gameId, dispatch, gameState]);

    return (
        <>
            <h1>Game Screen</h1>
            <h4>Game: {gameId}</h4>

            <ul>
                {gameState.players.map((player) => (
                    <li key={player.id}>
                        <p>{player.username} connected.</p>
                    </li>
                ))}
            </ul>
        </>
    );
}