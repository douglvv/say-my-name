import styles from './styles.module.css'
import { useSelector } from "react-redux";

const Quote = () => {
    const gameState = useSelector(state => state.game.game);

    return (
        <>
            <div className="d-flex justify-content-center align-items-center">
                <div className={`${styles.card} text-center m-3 p-3`}>
                    <div className={styles.cardHeader}>
                        <h6>Quote</h6>
                    </div>
                    <blockquote className="blockquote mb-0">
                        <h3>
                            {' '}
                            {gameState.quote.quote}
                            {' '}
                        </h3>
                    </blockquote>
                </div>
            </div>
        </>
    );
};

export default Quote;