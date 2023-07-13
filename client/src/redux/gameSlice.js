import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    id: null,
    players: [],
    quote: {},
    quoteHistory: [],
    quotesLeft: null,
}

export const gameSlice = createSlice({
    name: "game",
    initialState: initialState,
    reducers: {
        updateGameState: (state, action) => {
            state = action.payload.game;
        },
        finishGame: (state) => {
            state = initialState;
        }
    }
});

export const { updateGameState, finishGame } = gameSlice.actions;
export default gameSlice.reducer;
