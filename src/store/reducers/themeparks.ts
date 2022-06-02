import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import moment from "moment";
import { EntityLive, EntitySchedule, LiveData } from "../../themeparks";

export type AvailablePark = {
    id: string;
    name: string;
    resort: string;
}

export type EntitiesSchedules = {
    _?: EntitySchedule, 
} & {
    [id: string]: EntitySchedule,
}

type LiveDiffData = Array<{ entity: LiveData, from: LiveData['status'], to: LiveData['status'], occuredAt: number }>;

export type ThemeparksInterface = {
    available: Array<AvailablePark>;
    currentPark?: AvailablePark;
    live?: EntityLive;
    schedules?: EntitiesSchedules;
    lastUpdate?: number;
    diff: LiveDiffData
};

const initialState: ThemeparksInterface = {
    available: [],
    diff: [],
};

const themeparksSlice = createSlice({
    name: "themeparks",
    initialState,
    reducers: {
        saveAvailables(
            state,
            action: PayloadAction<ThemeparksInterface['available']>
        ) {
            state.available = action.payload;
        },
        saveCurrentPark(
            state,
            action: PayloadAction<AvailablePark | undefined>
        ) {
            state.currentPark = action.payload;
            state.live = undefined;
            state.schedules = undefined;
            state.diff = [];
        },
        saveLive(
            state,
            action: PayloadAction<EntityLive>
        ) {
            state.diff = action.payload.liveData.reduce((acc, curr) => {
                const diffs = (state.live?.liveData || []).filter((val) => {
                    return val.id === curr.id && val.status !== curr.status && (curr.status === 'DOWN' || val.status === 'DOWN')
                });

                const diffsIds = diffs.map(e => e.id);

                acc = acc.filter(e => diffsIds.indexOf(e.entity.id) === -1);

                acc.push(...diffs.map(entity => {
                    return { entity, from: entity.status, to: curr.status, occuredAt: moment().unix() }
                }));

                return acc;
            }, state.diff);

            state.live = action.payload;
            state.lastUpdate = moment().unix();
        },
        saveSchedule(state, action: PayloadAction<EntitySchedule>) {
            state.schedules = state.schedules || {};
            const today = moment();
            const tomorrow = moment().add(1, 'd');

            const lightWeight = action.payload;
            lightWeight.schedule = lightWeight.schedule.filter((schedule) => {
                return schedule.date === today.format('YYYY-MM-DD') 
                || schedule.date === tomorrow.format('YYYY-MM-DD')
            });
            
            switch (action.payload.entityType) {
                case 'PARK': state.schedules._ = lightWeight; break;
                default: state.schedules[action.payload.id] = lightWeight; break;
            }
        },
        dismissDiff(
            state,
            action: PayloadAction<string>
        ) {
            const newState = { ...state };
            state.diff = newState.diff.filter(e => e.entity.id !== action.payload);
        }
    },
});

export const { saveAvailables, saveCurrentPark, saveLive, saveSchedule, dismissDiff } = themeparksSlice.actions;
export default themeparksSlice.reducer;