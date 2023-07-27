import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SocketContext } from "../contexts/SocketContext";
import { useDispatch, useSelector } from "react-redux";
import { updateGameState, updatePlayerState } from "../redux/gameSlice";
import { Container } from 'react-bootstrap'
import Game from "../components/Game";

// TODO: adicionar navbar com opçao de sair do jogo
// TODO: game room screen enquanto aguarda o segundo player
// TODO: adicionar um log com o histório de cada turno, frase,
// resposta, player, resposta escolhida etc. Ao final de cada
// turno adiciona ao log.
export default function GameScreen() {
    const { gameId } = useParams();
    const gameState = useSelector((state) => state.game.game);
    const playerState = useSelector((state) => state.game.player);
    const dispatch = useDispatch();
    const socket = useContext(SocketContext);
    const [hasGameStarted, setHasGameStarted] = useState(false);
    const navigate = useNavigate();

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
        const handleStartGame = (data) => {
            handleUpdateGame(data);
            setHasGameStarted(true);
        };
        const handleFinishGame = (data) => {
            const game = data.game;

            dispatch(updateGameState({game: game}));
            
            game.players.forEach((player) => {
                if (player.id == playerState.id) dispatch(updatePlayerState({ player: player }));
            });

            navigate(`/game/${gameId}/finish`);          
        }

        socket.on("joinGame", handleJoinGame);
        socket.on("update", handleUpdateGame);
        socket.on("startGame", handleStartGame);
        socket.on("finishGame", handleFinishGame);

        return (() => {
            socket.off("joinGame", handleJoinGame)
            socket.off("update", handleUpdateGame);
            socket.off("startGame", handleStartGame);
            socket.off("finishGame", handleFinishGame);
        })
    }, [socket, dispatch, gameId, gameState, playerState, navigate])

    useEffect(() => {
        if (
            gameState.players.length === 2 &&
            playerState.isTurn &&
            hasGameStarted === false
        ) {
            socket.emit("startGame", { gameId: gameId });
        }
    }, [gameId, gameState.players.length, hasGameStarted, playerState.id, playerState.isTurn, socket])

    return (
        <>
            <Container className="vh-100">
                {hasGameStarted ? (
                    <>
                    <Game />
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