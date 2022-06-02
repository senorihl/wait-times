import moment from "moment";
import { EntitySchedule, LiveData } from ".";
import { useAppSelector } from "../store/hooks";

export const useLastUpdate = () => {
  const lastUpdated = useAppSelector((state) =>
    typeof state.themeparks.lastUpdate === "number"
      ? moment.unix(state.themeparks.lastUpdate)
      : undefined
  );
  return lastUpdated;
};

export const useAttractions = () => {
  const live = useAppSelector((state) => {
    return (state.themeparks.live?.liveData || []).reduce(
      (prev, curr) => {
        if (curr.entityType === "ATTRACTION") {
          prev[curr.status].push(curr);
          prev[curr.status] = prev[curr.status].sort((a, b) =>
            a.name.localeCompare(b.name)
          );
        }

        return prev;
      },
      {
        OPERATING: [],
        DOWN: [],
        CLOSED: [],
        REFURBISHMENT: [],
      } as {
        OPERATING: LiveData[];
        DOWN: LiveData[];
        CLOSED: LiveData[];
        REFURBISHMENT: LiveData[];
      }
    );
  });

  return live;
};

export const useShows = () => {
  const live = useAppSelector((state) => {
    return (state.themeparks.live?.liveData || []).reduce((prev, curr) => {
      if (curr.entityType === "SHOW") {
        let show = { ...curr };
        show.name = curr.name.trim();
        prev.push(show);
        prev = prev.sort((a, b) => a.name.localeCompare(b.name));
      }

      return prev;
    }, [] as LiveData[]);
  });

  return live;
};

export const useRestaurants = () => {
  const live = useAppSelector((state) => {
    return Object.values(state.themeparks.schedules || []).reduce(
      (prev, curr) => {
        if (curr.entityType === "RESTAURANT") {
          let show = { ...curr };
          show.name = curr.name.trim();
          prev.push(show);
          prev = prev.sort((a, b) => a.name.localeCompare(b.name));
        }

        return prev;
      },
      [] as EntitySchedule[]
    );
  });

  return live;
};

export const useAvailabilies = () => {
  const availabilies = useAppSelector((state) => {
    let availabilies = { ATTRACTION: false, RESTAURANT: false, SHOW: false };
    availabilies = (state.themeparks.live?.liveData || []).reduce(
      (prev, curr) => {
        if (Object.keys(prev).indexOf(curr.entityType) > -1) {
          prev[curr.entityType as keyof typeof prev] = true;
        }

        return prev;
      },
      availabilies
    );

    availabilies = Object.values(state.themeparks.schedules || {}).reduce(
      (prev, curr) => {
        if (Object.keys(prev).indexOf(curr.entityType) > -1) {
          prev[curr.entityType as keyof typeof prev] = true;
        }

        return prev;
      },
      availabilies
    );

    return availabilies;
  });

  return availabilies;
};
