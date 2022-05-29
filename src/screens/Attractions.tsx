import moment from "moment";
import React from "react";
import { ScrollView, View } from "react-native";
import { List, Paragraph, Subheading, useTheme } from "react-native-paper";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { dismissDiff } from "../store/reducers/themeparks";
import { LiveData } from "../themeparks";
import { useLastUpdate, useAttractions } from "../themeparks/hooks";

export const AttractionsScreen: React.FC = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const lastUpdated = useLastUpdate();
  const live = useAttractions();
  const diffs = useAppSelector((state) => state.themeparks.diff);
  const [expandedId, setExpandedId] = React.useState<
    string | number | undefined
  >("OPERATING");

  return (
    <ScrollView style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          flex: 1,
          alignItems: "stretch",
          justifyContent: "space-evenly",
        }}
      >
        {lastUpdated && (
          <Paragraph
            style={{
              alignSelf: "stretch",
              textAlign: "center",
              color: theme.colors.disabled,
            }}
          >
            Last updated at {lastUpdated.format("LTS")}
          </Paragraph>
        )}
      </View>
      <List.AccordionGroup
        expandedId={expandedId}
        onAccordionPress={(id) => {
          setExpandedId(id === expandedId ? undefined : id);
        }}
      >
        {Object.keys(live).map((key) => {
          const status = key as keyof typeof live;
          return (
            <List.Accordion
              title={`${status} (${live[status].length})`}
              id={status}
              key={`accordion-${status}`}
            >
              {live[status].map((entity: LiveData) => {
                return (
                  <List.Item
                    key={`accordion-${status}-${entity.id}`}
                    title={entity.name}
                    description={
                      typeof entity.queue?.SINGLE_RIDER?.waitTime !== "number"
                        ? undefined
                        : `Single rider: ${entity.queue.SINGLE_RIDER?.waitTime} min.`
                    }
                    right={({ color, ...props }) => (
                      <>
                        {typeof entity.queue?.STANDBY?.waitTime ===
                          "number" && (
                          <Paragraph {...props} style={{ color }}>
                            {entity.queue.STANDBY?.waitTime} min.
                          </Paragraph>
                        )}
                      </>
                    )}
                  />
                );
              })}
            </List.Accordion>
          );
        })}
        <List.Accordion title={`UPDATES (${diffs.length})`} id={"UPDATES"}>
          {diffs.map((e, index) => {
            return (
              <List.Item
                key={`accordion-UPDATES-${e.entity.id}-${index}`}
                onPress={() => {
                  dispatch(dismissDiff(e.entity.id));
                }}
                title={({ color, ...props }) => (
                  <View>
                    <Subheading style={{ color }}>{e.entity.name}</Subheading>
                    <Paragraph style={{ color }}>
                      Went from {e.from} to {e.to}
                    </Paragraph>
                  </View>
                )}
                description={moment.unix(e.occuredAt).fromNow()}
              />
            );
          })}
        </List.Accordion>
      </List.AccordionGroup>
    </ScrollView>
  );
};
