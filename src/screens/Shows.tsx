import { useFocusEffect } from "@react-navigation/native";
import moment from "moment";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useTheme, List, Badge, Paragraph } from "react-native-paper";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { saveLive } from "../store/reducers/themeparks";
import { getEntityLive } from "../themeparks";
import { useShows } from "../themeparks/hooks";

export const ShowsScreen: React.FC = () => {
  const theme = useTheme();
  const shows = useShows();
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
              const showtimes = show.showtimes.map((time) =>
                moment(time.startTime).format("LT")
              );
              const lastShowtime = showtimes.pop();
              return (
                <View>
                  <Paragraph
                    {...props}
                    style={{ color: props.color, fontSize: props.fontSize }}
                  >
                    Next representation{show.showtimes.length > 1 ? "s" : ""}
                  </Paragraph>
                  <Paragraph
                    style={{
                      color: theme.colors.primary,
                      fontSize: props.fontSize,
                    }}
                  >
                    {showtimes.length === 0
                      ? lastShowtime
                      : `${showtimes.join(", ")} and ${lastShowtime}`}
                  </Paragraph>
                </View>
              );
            }}
          />
        );
      })}
    </ScrollView>
  );
};
