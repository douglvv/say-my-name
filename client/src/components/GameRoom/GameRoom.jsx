import { Navbar, Container, Card, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useContext, useEffect, useRef } from "react";
import { useClipboard } from 'use-clipboard-copy';
import { FiCopy, FiCheck } from 'react-icons/fi';
import styles from './styles.module.css'
import { SocketContext } from "../../contexts/SocketContext";
import { updateGameState } from "../../redux/gameSlice";
import { useNavigate } from "react-router-dom";

const GameRoom = () => {
    const gameState = useSelector((state) => state.game.game);
    const clipboard = useClipboard({ copiedTimeout: 3000 });
    const gameIdRef = useRef(null);
    const socket = useContext(SocketContext);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const quit = () => {
        socket.emit("quitRoom", { gameId: gameState.id, playerId: socket.id });
    }

    useEffect(() => {
        const handleQuitRoom = (data) => {
            const game = data;

            dispatch(updateGameState({ game: game }))
            navigate("/");
        }

        socket.on("quitRoom", handleQuitRoom);

        return (() => {
            socket.off("quitRoom", handleQuitRoom);
        })
    }, [socket, gameState, dispatch, navigate])

    return (
        <>
            <Navbar >
                <Container className="justify-content-between">
                    <Navbar.Brand className="text-light">Game Room</Navbar.Brand>
                    <Button onClick={quit}>Quit</Button>
                </Container>
            </Navbar>

            <div className="menu-container">
                <ul className="list-unstyled">
                    <li className="list-unstyled-item">
                        <p className="mx-3 mb-0">Game ID:</p>
                        <div className={`mt-1 m-3 ${styles.wrapper}`}>
                            <div className="p-2 d-flex justify-content-between align-items-start">
                                <p ref={gameIdRef}>{gameState.id}</p>
                                <button
                                    onClick={() => clipboard.copy(gameIdRef.current.textContent)}
                                    title="Copy Game ID"
                                    className={`${styles.iconButton} text-dark`}
                                >
                                    {clipboard.copied ? <FiCheck /> : <FiCopy />}
                                </button>
                            </div>
                        </div>
                    </li>

                    <hr />
                    <p className="mx-3 mb-0">Players:</p>
                    {gameState.players.map((player) => (
                        <li key={player.id} className="list-unstyled-item">
                            <div className={`${styles.wrapper} mt-1 m-3 p-2`}>
                                <p>{player.username} connected.</ p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
};

export default GameRoom;