import { useFocusEffect } from "@react-navigation/native";
import React from "react";
import { Pressable, View } from "react-native";
import { Button, Headline, Portal, useTheme } from "react-native-paper";
import { useAppDispatch } from "../store/hooks";
import { AvailablePark, saveCurrentPark } from "../store/reducers/themeparks";
import { ParkDialog } from "./Settings";

export const InitializationScreen: React.FC = () => {
  const [visible, setVisible] = React.useState(false);
  const theme = useTheme();
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);
  const dispatch = useAppDispatch();
  useFocusEffect(
    React.useCallback(() => {
      dispatch(saveCurrentPark(undefined));
    }, [])
  );
  const onSave = (park: AvailablePark) => {
    dispatch(saveCurrentPark(park));
  };

  return (
    <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
      <Headline style={{ textAlign: "center" }}>
        Please{" "}
        <Pressable onPress={showDialog} style={{ color: theme.colors.primary }}>
          choose a park
        </Pressable>{" "}
        to continue
      </Headline>

      <Portal>
        <ParkDialog
          visible={visible}
          initial={undefined}
          onDismiss={hideDialog}
          onSave={onSave}
        />
      </Portal>
    </View>
  );
};
