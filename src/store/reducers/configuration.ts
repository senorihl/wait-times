import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ConfigurationInterface = {
    appearenceMode?: "light" | "dark";
};

const initialState: ConfigurationInterface = {};

const configurationSlice = createSlice({
    name: "configuration",
    initialState,
    reducers: {
        saveAppearenceMode(
            state,
            action: PayloadAction<undefined | "light" | "dark">
        ) {
            state.appearenceMode = action.payload;
        },
    },
});

export const { saveAppearenceMode } = configurationSlice.actions;
export default configurationSlice.reducer;