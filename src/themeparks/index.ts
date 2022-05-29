import axios from "axios"

const baseClient = axios.create({
    baseURL: 'https://api.themeparks.wiki/v1/',
    responseType: 'json'
});

export interface Park {
    id: string;
    name: string;
    resort: string;
}

interface Destination {
    id: string;
    name: string;
    slug: string;
    parks: Array<{
        id: string;
        name: string;
    }>
}

type EntityType = 'DESTINATION' | 'PARK' | 'ATTRACTION' | 'RESTAURANT' | 'HOTEL' | 'SHOW';

interface Tag {
    tag: string
    tagName: string
    id: string
    value: string | number
}

export interface Entity {
    id: string,
    name: string,
    entityType: EntityType,
    parentId: string | null,
    destinationId: string | null,
    timezone: string,
    location: null | { latitude: number, longitude: number }
    tags: Tag[]
}

export type EntityChildren = Pick<Entity, 'id' | 'name' | 'entityType' | 'timezone'> & {
    children: Array<Pick<Entity, 'id' | 'name' | 'entityType'>>
}


export type EntitySchedule = Pick<Entity, 'id' | 'name' | 'entityType' | 'timezone'> & {
    schedule: Array<{
        date: string,
        openingTime: string,
        closingTime: string,
        type: 'OPERATING' | 'TICKETED_EVENT' | 'PRIVATE_EVENT' | 'EXTRA_HOURS' | 'INFO'
    }>
}

type LiveQueue = Partial<{
    STANDBY: {
        waitTime: number
    },
    SINGLE_RIDER: {
        waitTime: number
    }
    RETURN_TIME: {
        state: 'AVAILABLE' | 'TEMP_FULL' | 'FINISHED';
        returnStart: string
        returnEnd: string
    },
    PAID_RETURN_TIME: {
        state: 'AVAILABLE' | 'TEMP_FULL' | 'FINISHED'
        returnStart: string
        returnEnd: string
        price: {
            amount: number
            currency: string
        }
    },
    BOARDING_GROUP: {
        allocationStatus: 'AVAILABLE' | 'PAUSED' | 'CLOSED'
        currentGroupStart: string | null,
        currentGroupEnd: string | null,
        nextAllocationTime: string | null,
        estimatedWait: number | null
    }
}>;

export interface LiveData {
    id: string
    name: string
    entityType: EntityType
    status: 'OPERATING' | 'DOWN' | 'CLOSED' | 'REFURBISHMENT'
    lastUpdated: string
    queue: LiveQueue,
    showtimes: Array<{
        "type": string,
        "startTime": string,
        "endTime": string
    }>

}

export type EntityLive = Pick<Entity, 'id' | 'name' | 'entityType' | 'timezone'> & {
    liveData: Array<LiveData>
}

export const getAvailablesParks: () => Promise<Array<Park>> = async () => {
    const res = await baseClient.get('destinations');
    const parks: Array<Park> = [];
    const destinations = (res.data?.destinations || []) as Array<Destination>;

    destinations.forEach((destination) => {
        destination.parks.forEach((park) => {
            parks.push({ id: park.id, name: park.name, resort: destination.name })
        })
    });

    return parks;
}

export const getEntity: (id: string) => Promise<Entity> = async (id) => {
    const res = await baseClient.get(`entity/${id}`);
    const entity = res.data as Entity;
    return entity;
}

export const getEntityChildren: (id: string) => Promise<EntityChildren> = async (id) => {
    const res = await baseClient.get(`entity/${id}/children`);
    const entity = res.data as EntityChildren;
    return entity;
}

export const getEntityLive: (id: string) => Promise<EntityLive> = async (id) => {
    const res = await baseClient.get(`entity/${id}/live`);
    const entity = res.data as EntityLive;

    return entity;
}

export const getEntityScheduleNextThirtyDays: (id: string) => Promise<EntitySchedule> = async (id) => {
    const res = await baseClient.get(`entity/${id}/schedule`);
    const entity = res.data as EntitySchedule;
    return entity;
}

export const getEntityScheduleOn: (id: string, year: number, month: number) => Promise<EntitySchedule> = async (id, year, month) => {
    const res = await baseClient.get(`entity/${id}/schedule/${year}/${month}`);
    const entity = res.data as EntitySchedule;
    return entity;
}