import React from "react";
import { Alert, Linking, ScrollView } from "react-native";
import {
  List,
  Paragraph,
  Portal,
  Dialog,
  Button,
  RadioButton,
  useTheme,
} from "react-native-paper";
import { persistor } from "../store";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { saveAppearenceMode } from "../store/reducers/configuration";
import { AvailablePark, saveCurrentPark } from "../store/reducers/themeparks";
import { openURL } from "expo-linking";

export const SettingsScreen: React.FC = () => {
  const [visible, setVisible] = React.useState(false);

  const appearenceMode = useAppSelector(
    (state) => state.configuration.appearenceMode
  );

  const currentPark = useAppSelector((state) => state.themeparks.currentPark);

  const onSave = (park: AvailablePark) => {
    dispatch(saveCurrentPark(park));
  };

  const theme = useTheme();

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const dispatch = useAppDispatch();
  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{
        flex: 1,
      }}
    >
      <List.Section title="Appearence">
        <List.Item
          title="Mode"
          description="Tap to change"
          onPress={() => {
            const currIndex = ["dark", "light"].indexOf(appearenceMode || "");
            switch (currIndex) {
              case 0:
                dispatch(saveAppearenceMode("light"));
                break;
              case 1:
                dispatch(saveAppearenceMode());
                break;
              default:
                dispatch(saveAppearenceMode("dark"));
            }
          }}
          right={(props) => (
            <Paragraph {...props}>
              {appearenceMode === "dark"
                ? "Dark mode"
                : appearenceMode === "light"
                ? "Light mode"
                : "Automatic"}
            </Paragraph>
          )}
        />
      </List.Section>
      <List.Section title="Park">
        <List.Item
          title={"Current park"}
          description="Tap to change"
          onPress={showDialog}
          right={(props) => (
            <Paragraph {...props}>
              {currentPark?.name || "None selected"}
            </Paragraph>
          )}
        />
      </List.Section>
      <List.Section title="Licenses">
        <List.Item
          title="Icons made by nawicon from www.flaticon.com"
          onPress={() => {
            openURL("https://www.flaticon.com/authors/nawicon").catch(() => {});
          }}
        />
        <List.Item
          title="Icons made by Freepik from www.flaticon.com"
          onPress={() => {
            openURL("https://www.freepik.com").catch(() => {});
          }}
        />
      </List.Section>

      {__DEV__ && (
        <List.Section
          title="Developer options"
          style={{
            marginTop: "auto",
          }}
        >
          <List.Item
            title="Reset storage"
            onPress={() => {
              Alert.alert("Are you sure to rest all storage ?", undefined, [
                {
                  text: "Reset storage",
                  style: "destructive",
                  onPress: async () => {
                    await persistor.purge();
                  },
                },
                {
                  text: "Cancel",
                  style: "cancel",
                },
              ]);
            }}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
          />
        </List.Section>
      )}
      <Portal>
        <ParkDialog
          visible={visible}
          initial={currentPark}
          onDismiss={hideDialog}
          onSave={onSave}
        />
      </Portal>
    </ScrollView>
  );
};

export const ParkDialog: React.FC<{
  visible: boolean;
  onDismiss: () => void;
  initial: AvailablePark | undefined;
  onSave: (value: AvailablePark) => void;
}> = ({ visible, initial, onDismiss = () => {}, onSave = () => {} }) => {
  const [selected, setSelected] = React.useState(initial);
  const parks = useAppSelector((state) =>
    state.themeparks.available.reduce((prev, curr) => {
      prev[curr.id] = curr;
      return prev;
    }, {} as { [id: string]: AvailablePark })
  );
  return (
    <Dialog
      visible={visible}
      onDismiss={onDismiss}
      style={{
        maxHeight: "80%",
      }}
    >
      <Dialog.Title>Available parks</Dialog.Title>
      <Dialog.ScrollArea style={{ paddingHorizontal: 0 }}>
        <ScrollView>
          <RadioButton.Group
            onValueChange={(value) => {
              setSelected(parks[value]);
            }}
            value={selected?.id || ""}
          >
            {Object.values(parks).map(({ name, id, resort }) => {
              return (
                <RadioButton.Item
                  key={`park-dialog-${id}`}
                  value={id}
                  label={resort !== name ? resort + "\n" + name : name}
                  status={selected?.id === id ? "checked" : "unchecked"}
                />
              );
            })}
          </RadioButton.Group>
        </ScrollView>
      </Dialog.ScrollArea>
      <Dialog.Actions>
        <Button onPress={onDismiss}>Cancel</Button>
        <Button
          disabled={!selected}
          onPress={() => {
            onSave(selected as AvailablePark);
            onDismiss();
          }}
        >
          Save
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
};
