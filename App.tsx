import React from "react";
import * as SplashScreen from "expo-splash-screen";
import App from "./src";
import { getAvailablesParks } from "./src/themeparks";
import { Provider as StoreProvider } from "react-redux";
import store from "./src/store";
import { saveAvailables } from "./src/store/reducers/themeparks";

export default function Root() {
  const [appIsReady, setAppIsReady] = React.useState(false);

  React.useEffect(() => {
    async function prepare() {
      try {
        // Keep the splash screen visible while we fetch resources
        await SplashScreen.preventAutoHideAsync();
        // Artificially delay for two seconds to simulate a slow loading
        // experience. Please remove this if you copy and paste the code!
        store.dispatch(saveAvailables(await getAvailablesParks()));
      } catch (e) {
        console.warn(e);
      } finally {
      }
    }

    prepare();
  }, []);

  React.useEffect(() => {
    return store.subscribe((...args) => {
      setAppIsReady(store.getState().themeparks.available.length > 0);
    });
  }, []);

  const onLayoutRootView = React.useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <StoreProvider store={store}>
      <App onLayout={onLayoutRootView} />
    </StoreProvider>
  );
}
