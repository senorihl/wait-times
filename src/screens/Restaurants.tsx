import { useFocusEffect } from "@react-navigation/native";
import moment from "moment";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useTheme, List, Badge, Paragraph } from "react-native-paper";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { saveLive } from "../store/reducers/themeparks";
import { getEntityLive } from "../themeparks";
import { useRestaurants } from "../themeparks/hooks";

export const RestaurantsScreen: React.FC = () => {
  const theme = useTheme();
  const restaurants = useRestaurants();
  const today = moment();

  return (
    <ScrollView style={{ flex: 1 }}>
      {restaurants.map((restaurant) => {
        const schedule = restaurant.schedule.filter(
          (schedule) => schedule.date === today.format("YYYY-MM-DD")
        );

        return (
          <List.Item
            key={`restaurand-${restaurant.id}`}
            title={restaurant.name}
            description={(props) => {
              if (schedule.length === 0) {
                return (
                  <View style={{ flexDirection: "row" }}>
                    <Paragraph
                      style={{
                        color: theme.colors.error,
                        fontSize: props.fontSize,
                      }}
                    >
                      CLOSED
                    </Paragraph>
                  </View>
                );
              } else {
                return (
                  <View>
                    {schedule.map((schedule, index) => (
                      <Paragraph
                        key={`restaurand-${restaurant.id}-schedule-${index}`}
                        style={{ color: props.color, fontSize: props.fontSize }}
                      >
                        From {moment(schedule.openingTime).format("LT")} to{" "}
                        {moment(schedule.closingTime).format("LT")}
                      </Paragraph>
                    ))}
                  </View>
                );
              }
            }}
          />
        );
      })}
    </ScrollView>
  );
};
