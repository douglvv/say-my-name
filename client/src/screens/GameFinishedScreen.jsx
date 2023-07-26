import { Container } from "react-bootstrap";
import GameFinished from "../components/GameFinished/GameFinished";
import GameFinishedButtons from "../components/GameFinishedButtons/GameFinishedButtons";

// TODO: listener para resposta do servidor para quit e play again
// listener no servidor para quit e play again

const GameFinishedScreen = () => {
    return (
        <>
            <Container className="vh-100 text-center">
                <GameFinished />
                <GameFinishedButtons />
            </Container>
        </>
    );
}

export default GameFinishedScreen;