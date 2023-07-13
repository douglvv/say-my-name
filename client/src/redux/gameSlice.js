import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    game: {
        id: null,
        players: [],
        quote: {},
        quoteHistory: [],
        quotesLeft: null,
    }
}

export const gameSlice = createSlice({
    name: "game",
    initialState: initialState,
    reducers: {
        updateGameState: (state, action) => {
            console.log("game state: ",action.payload.game)
            state.game = action.payload.game;
        },
        finishGame: (state) => {
            state.game = initialState;
        }
    }
});

export const { updateGameState, finishGame } = gameSlice.actions;
export default gameSlice.reducer;
