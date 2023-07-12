import React from "react";
import { useParams } from "react-router-dom";


export default function GameScreen() {
    const { gameId } = useParams();

    return (
        <>
            <h1>Game Screen</h1>
            <h4>Game: {gameId}</h4>
        </>
    )
}