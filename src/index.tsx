import React from "react";
import { Appbar, Provider as PaperProvider } from "react-native-paper";
import { LogBox, useColorScheme, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";
import { useAppSelector } from "./store/hooks";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { InitializationScreen, MainScreen } from "./screens";
import { StatusBar } from "expo-status-bar";
import * as Linking from "expo-linking";

import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";
import {
  DarkTheme as PaperDarkTheme,
  DefaultTheme as PaperDefaultTheme,
} from "react-native-paper";

LogBox.ignoreLogs([
  "[react-native-gesture-handler] Seems like you're using an old API with gesture components, check out new Gestures system!",
  "`FirebaseAnalytics.setCurrentScreen` is deprecated",
  "Setting a timer for a long period of time, i.e. multiple minutes, is a performance and correctness issue on Android",
]);

const RootStack = createNativeStackNavigator();

const CombinedDefaultTheme = {
  ...PaperDefaultTheme,
  ...NavigationDefaultTheme,
  colors: {
    ...PaperDefaultTheme.colors,
    ...NavigationDefaultTheme.colors,
  },
};
const CombinedDarkTheme = {
  ...PaperDarkTheme,
  ...NavigationDarkTheme,
  colors: {
    ...PaperDarkTheme.colors,
    ...NavigationDarkTheme.colors,
  },
};

const prefix = Linking.createURL("/");

const App: React.FC<{ onLayout: View["props"]["onLayout"] }> = ({
  onLayout,
}) => {
  const navigationRef = useNavigationContainerRef();
  const routeNameRef = React.useRef<string>();
  const originalScheme = useColorScheme();
  const scheme = useAppSelector(
    (state) => state.configuration.appearenceMode || originalScheme
  );
  const theme = useAppSelector(() =>
    scheme === "dark" ? CombinedDarkTheme : CombinedDefaultTheme
  );
  const currentPark = useAppSelector((state) => state.themeparks.currentPark);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.dark
          ? theme.colors.border
          : theme.colors.primary,
      }}
      onLayout={onLayout}
    >
      <StatusBar
        backgroundColor={
          theme.dark ? theme.colors.border : theme.colors.primary
        }
        style={"light"}
      />
      <SafeAreaProvider>
        <PaperProvider theme={theme}>
          <NavigationContainer
            theme={theme}
            ref={navigationRef}
            linking={{
              prefixes: [prefix],
              config: {
                screens: {
                  Main: {
                    screens: {
                      Attractions: "/attractions",
                      Restaurants: "/restaurants",
                      Shows: "/shows",
                      Settings: "/settings",
                    },
                  },
                  Initialization: "/__init",
                },
              },
            }}
            onReady={() => {
              routeNameRef.current = navigationRef.getCurrentRoute()?.name;
            }}
          >
            <RootStack.Navigator>
              {currentPark ? (
                <RootStack.Screen
                  name="Main"
                  component={MainScreen}
                  options={{
                    header: (headerProps) => (
                      <Appbar.Header theme={theme}>
                        {headerProps.navigation.canGoBack() && (
                          <Appbar.BackAction
                            onPress={headerProps.navigation.goBack}
                          />
                        )}
                        <Appbar.Content
                          title={currentPark.name}
                          subtitle={currentPark.resort}
                        />
                      </Appbar.Header>
                    ),
                  }}
                />
              ) : (
                <RootStack.Screen
                  name="Initialization"
                  component={InitializationScreen}
                  options={{
                    header: (headerProps) => (
                      <Appbar.Header theme={theme}>
                        {headerProps.navigation.canGoBack() && (
                          <Appbar.BackAction
                            onPress={headerProps.navigation.goBack}
                          />
                        )}
                        <Appbar.Content
                          title={"Please choose a park to continue"}
                        />
                      </Appbar.Header>
                    ),
                  }}
                />
              )}
            </RootStack.Navigator>
          </NavigationContainer>
        </PaperProvider>
      </SafeAreaProvider>
    </View>
  );
};

export default App;
