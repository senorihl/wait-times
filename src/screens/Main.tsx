import React, { Children } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useFocusEffect } from "@react-navigation/native";
import { View, Image } from "react-native";
import { MainTabParamList } from "../types/navigation";
import { SettingsScreen } from "./Settings";
import { AttractionsScreen } from "./Attractions";
import { ShowsScreen } from "./Shows";
import { RestaurantsScreen } from "./Restaurants";
import { useAvailabilies } from "../themeparks/hooks";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  EntitySchedule,
  getEntityChildren,
  getEntityLive,
  getEntityScheduleNextThirtyDays,
} from "../themeparks";
import { saveLive, saveSchedule } from "../store/reducers/themeparks";

const Tab = createBottomTabNavigator<MainTabParamList>();
const tick_interval = 1000 * 60;

export const MainScreen: React.FC = () => {
  const availabilies = useAvailabilies();
  const dispatch = useAppDispatch();
  const current = useAppSelector((state) => state.themeparks.currentPark);

  let interval: null | number = null;

  const startAutoRefresh = () => {
    endAutoRefresh();
    interval = setInterval(() => {
      if (!current) return;
      getEntityLive(current.id).then(saveLive).then(dispatch);
    }, tick_interval) as unknown as number;
  };

  const endAutoRefresh = () => {
    if (interval !== null) {
      clearInterval(interval);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      if (!current) return;
      getEntityLive(current.id)
        .then(saveLive)
        .then(dispatch)
        .then(startAutoRefresh);

      getEntityChildren(current.id)
        .then((res) => {
          const promises: Array<
            ReturnType<typeof getEntityScheduleNextThirtyDays>
          > = [getEntityScheduleNextThirtyDays(res.id)];
          res.children.forEach((child) =>
            promises.push(getEntityScheduleNextThirtyDays(child.id))
          );
          return Promise.all(promises);
        })
        .then((schedules) => schedules.map(saveSchedule).map(dispatch));
      return () => {
        endAutoRefresh();
      };
    }, [current])
  );

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        {availabilies.ATTRACTION && (
          <Tab.Screen
            name="Attractions"
            component={AttractionsScreen}
            options={{
              tabBarIcon: (iconProps) => (
                <Image
                  source={require("../../assets/005-carousel.png")}
                  style={{
                    tintColor: iconProps.color,
                    resizeMode: "contain",
                    width: iconProps.size,
                    height: iconProps.size,
                  }}
                  {...iconProps}
                />
              ),
            }}
          />
        )}

        {availabilies.SHOW && (
          <Tab.Screen
            name="Shows"
            component={ShowsScreen}
            options={{
              tabBarIcon: (iconProps) => (
                <Image
                  source={require("../../assets/001-theater.png")}
                  style={{
                    tintColor: iconProps.color,
                    resizeMode: "contain",
                    width: iconProps.size,
                    height: iconProps.size,
                  }}
                  {...iconProps}
                />
              ),
            }}
          />
        )}
        {availabilies.RESTAURANT && (
          <Tab.Screen
            name="Restaurants"
            component={RestaurantsScreen}
            options={{
              tabBarIcon: (iconProps) => (
                <Image
                  source={require("../../assets/009-restaurant.png")}
                  style={{
                    tintColor: iconProps.color,
                    resizeMode: "contain",
                    width: iconProps.size,
                    height: iconProps.size,
                  }}
                  {...iconProps}
                />
              ),
            }}
          />
        )}

        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarIcon: (iconProps) => (
              <Image
                source={require("../../assets/010-options.png")}
                style={{
                  tintColor: iconProps.color,
                  resizeMode: "contain",
                  width: iconProps.size,
                  height: iconProps.size,
                }}
                {...iconProps}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </View>
  );
};
