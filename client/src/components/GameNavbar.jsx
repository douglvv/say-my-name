import { useContext } from "react"
import { Navbar, Button, Container } from "react-bootstrap"
import { SocketContext } from "../contexts/SocketContext"
import { useSelector } from "react-redux";

const GameNavbar = () => {
    const socket = useContext(SocketContext);
    const gameState = useSelector(state => state.game.game);
    return (
        <Navbar >
            <Container className="justify-content-between">
                <Navbar.Brand className="text-light">Game Room</Navbar.Brand>
                <Button
                    onClick={() => socket.emit("quitGame", { gameId: gameState.id })}
                >
                    Quit
                </Button>
            </Container>
        </Navbar>
    )
}

export default GameNavbar;