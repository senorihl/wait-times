import { combineReducers } from "@reduxjs/toolkit";
import configuration from "./configuration";
import themeparks from "./themeparks";

const rootReducer = combineReducers({
    configuration,
    themeparks,
});

export default rootReducer;