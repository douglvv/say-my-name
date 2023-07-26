import { Container } from "react-bootstrap";
import GameFinished from "../components/GameFinished/GameFinished";


const GameFinishedScreen = () => {
    return (
        <>
            <Container className="vh-100 text-center">
                <GameFinished />
            </Container>
        </>
    );
}

export default GameFinishedScreen;