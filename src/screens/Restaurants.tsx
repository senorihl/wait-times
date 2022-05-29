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
  const shows = useRestaurants();
  const dispatch = useAppDispatch();
  const current = useAppSelector((state) => state.themeparks.currentPark);

  useFocusEffect(
    React.useCallback(() => {
      if (!current) return;
      getEntityLive(current.id).then(saveLive).then(dispatch);
    }, [current])
  );

  return (
    <ScrollView style={{ flex: 1 }}>
      {shows.map((show) => {
        return (
          <List.Item
            key={`show-${show.id}`}
            title={show.name}
            description={(props) => {
              return (
                <View>
                  <Paragraph {...props} style={{ color: props.color }}>
                    Next representation{show.showtimes.length > 1 ? "s" : ""}
                  </Paragraph>
                  <View style={{ flexDirection: "row" }}>
                    {show.showtimes.map((time) => {
                      return (
                        <Badge
                          size={25}
                          style={{
                            backgroundColor: theme.colors.background,
                            borderColor: theme.colors.primary,
                            borderWidth: StyleSheet.hairlineWidth,
                            color: theme.colors.primary,
                            marginRight: 5,
                          }}
                          key={`show-${show.id}-time-${time.startTime}`}
                        >
                          {moment(time.startTime).format("LT")}
                        </Badge>
                      );
                    })}
                  </View>
                </View>
              );
            }}
          />
        );
      })}
    </ScrollView>
  );
};
