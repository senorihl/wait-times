import { useFocusEffect } from "@react-navigation/native";
import React from "react";
import { ScrollView, View } from "react-native";
import { Button, useTheme, RadioButton } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { AvailablePark, saveCurrentPark } from "../store/reducers/themeparks";

export const InitializationScreen: React.FC = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  useFocusEffect(
    React.useCallback(() => {
      dispatch(saveCurrentPark(undefined));
    }, [])
  );
  const onSave = (park: AvailablePark) => {
    dispatch(saveCurrentPark(park));
  };
  const [selected, setSelected] = React.useState<AvailablePark>();
  const parks = useAppSelector((state) =>
    state.themeparks.available.reduce((prev, curr) => {
      prev[curr.id] = curr;
      return prev;
    }, {} as { [id: string]: AvailablePark })
  );

  return (
    <View
      style={{
        flex: 1,
        paddingBottom: insets.bottom,
      }}
    >
      <ScrollView
        style={{
          backgroundColor: theme.colors.background,
        }}
      >
        <RadioButton.Group
          onValueChange={(value) => {
            setSelected(parks[value as keyof typeof parks]);
          }}
          value={selected?.id || ""}
        >
          {Object.values(parks).map(({ name, id, resort }) => {
            return (
              <RadioButton.Item
                key={`park-initialize-${id}`}
                value={id}
                label={resort !== name ? resort + "\n" + name : name}
                status={selected?.id === id ? "checked" : "unchecked"}
                color={theme.colors.primary}
              />
            );
          })}
        </RadioButton.Group>
        <Button
          disabled={!selected}
          mode="contained"
          style={{ margin: 10 }}
          onPress={() => selected && onSave(selected)}
        >
          Continue{!selected ? "" : ` with ${selected.name}`}
        </Button>
      </ScrollView>
    </View>
  );
};
