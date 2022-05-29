import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import rootReducer from './reducers';
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

const persistConfig = {
    key: '@redux-store',
    storage: AsyncStorage,
    debug: true,
    version: 1,
};

export const store = configureStore({
    // @ts-ignore
    reducer: persistReducer(persistConfig, rootReducer) as typeof rootReducer,
    middleware: getDefaultMiddleware => {
        return [
            ...getDefaultMiddleware({
                serializableCheck: {
                    ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
                },
            }),
            // store => next => action => {
            //   console.log('dispatching', action)
            //   let result = next(action)
            //   console.log('next state', store.getState())
            //   return result
            // }
        ]
    }

});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;