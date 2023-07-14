import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    game: {
        id: null,
        players: [],
        quote: {},
        quoteHistory: [],
        quotesLeft: null,
    },
    player: {
        id: null,
        username: null,
        points: 0,
        isTurn: false
    }
}

export const gameSlice = createSlice({
    name: "game",
    initialState: initialState,
    reducers: {
        updateGameState: (state, action) => {
            state.game = action.payload.game;
            localStorage.setItem("game", JSON.stringify(action.payload.game))
        },
        setPlayerId: (state, action) => {
            state.player.id = action.payload.id;
            // console.log(state.player.id);                        
            localStorage.setItem("player", JSON.stringify(state.player));
        },
        updatePlayerState: (state, action) => {
            state.player = action.payload.player;
            // console.log(state.player);            
            localStorage.setItem("player", JSON.stringify(action.payload.player))
        },
        finishGame: (state) => {
            state.game = initialState;
            localStorage.removeItem("game");
        }
    }
});

export const { updateGameState, setPlayerId, updatePlayerState, finishGame } = gameSlice.actions;
export default gameSlice.reducer;
