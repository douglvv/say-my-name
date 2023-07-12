import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { SocketContext } from "../contexts/SocketContext";


// TODO: redux storage para o objeto do jogo

export default function GameScreen() {
    const { gameId } = useParams();
    const game = JSON.parse(localStorage.getItem("game"));
    const socket = useContext(SocketContext);

    useEffect(() => {
        socket.on("joinGame", (data) => {
            const updatedGame = data;

            localStorage.setItem("game", JSON.stringify(updatedGame))
        })

        return(() => {

        })
    },[socket, gameId])

    return (
        <>
            <h1>Game Screen</h1>
            <h4>Game: {gameId}</h4>

            <ul>
            {game.players.map((player) => (
                    <li key={player.id}>
                        <p>{player.username} connected.</p>
                    </li>
                ))}
            </ul>
        </>
    )
}