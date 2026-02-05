import { type StaticStore } from "./calendar.store";
import { YearStore } from "./years.store";
import { MonthStore } from "./month.store";
import { type Readable, derived, get } from "svelte/store";
import { nanoid, wrap } from "../utils/functions";
import type {
    NamedWeek,
    DayOrLeapDay,
    DefinedLeapDay,
    Era,
} from "src/schemas/calendar/timespans";

export class WeekStore {
    constructor(
        public week: NamedWeek,
        public month: MonthStore,
        public staticStore: StaticStore
    ) {}
    get name() {
        return this.week.name;
    }
    get abbreviation() {
        return this.week.abbreviation ?? this.week.name?.substring(0, 3).toUpperCase();
    };
    index = derived([this.month.customWeeks], ([weeks]) => {
        return weeks.indexOf(this.week);
    });
    weekdays = derived([this.staticStore.weekdays], ([week]) => {
        return week;
    });
    days = derived([this.staticStore.weekdays], ([week]) => {
        return week.length;
    });

    /**
     * This should return every day of the month, sorted into its appropriate week.
     * Each array represents 1 week.
     * Each element within each array represents 1 day.
     *
     * To "skip" days in the UI, null should be used.
     */
    daysInWeek: Readable<Array<(DayOrLeapDay | null)>> = derived(
        [
            this.weekdays,
            this.days,
            this.staticStore.staticData,
        ],
        ([weekdays, days, data]) => {
            //Initialize the day array.
            let dayArray: (DayOrLeapDay | null)[] = [];
            let daysAdded = 0;
            while (daysAdded < days) {
                dayArray.push({
                    type: "day",
                    number: daysAdded,
                    name: null,
                    id: nanoid(3),
                });
            }

            return dayArray;
        }
    );
}
