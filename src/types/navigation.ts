import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type {
    CompositeScreenProps,
    NavigatorScreenParams,
} from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

export type RootStackParamList = {
    Main: NavigatorScreenParams<MainTabParamList>;
    Initialization: undefined
};

export type MainTabParamList = {
    Attractions: undefined;
    Shows: undefined;
    Restaurants: undefined;
    Settings: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
    NativeStackScreenProps<RootStackParamList, T>;

export type MainTabScreenProps<T extends keyof MainTabParamList> =
    CompositeScreenProps<
        BottomTabScreenProps<MainTabParamList, T>,
        RootStackScreenProps<keyof RootStackParamList>
    >;

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList { }
    }
}
