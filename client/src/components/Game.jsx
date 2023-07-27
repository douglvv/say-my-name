import Scoreboard from "./Scoreboard/Scoreboard";
import Quote from "./Quote/Quote";
import AnswerOptions from "./AnswerOptions/AnswerOptions";
import GameNavbar from "./GameNavbar";

const Game = () => {
    return (
        <>
            <GameNavbar />
            <Scoreboard />
            <Quote />
            <AnswerOptions />
        </>
    );
};

export default Game;