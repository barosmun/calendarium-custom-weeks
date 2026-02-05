<script lang="ts">
    import { getTypedContext } from "src/calendar/view.utils";
    import Day from "../Day/Day.svelte";
    import { get } from "svelte/store";
    import type { DayOrLeapDay, NamedWeek } from "src/schemas/calendar/timespans";

    export let year: number;
    export let month: number;
    export let weekNumber: number;
    export let dayArray: (DayOrLeapDay | null)[];

    const global = getTypedContext("store");
    const ephemeral = getTypedContext("ephemeralStore");

    $: store = $global;
    $: useCustomWeeks = $store.static.useCustomWeeks;
    $: customWeekNumber = (weekNumber-1) % ($store.static.weeks?.length ?? 0);
    $: yearCalculator = store.yearCalculator;
    $: displayWeeks = $ephemeral.displayWeeks;
    $: displayedMonth = yearCalculator
        .getYearFromCache(year)
        .getMonthFromCache(month);
    $: displayedWeek = yearCalculator
        .getYearFromCache(year)
        .getMonthFromCache(month)
        .getWeekFromCache(customWeekNumber);
    $: daysInMonth = displayedMonth.days;
    $: daysInWeek = displayedWeek.days;
    $: days = useCustomWeeks ? daysInWeek : daysInMonth;

    $: previousMonth = $ephemeral.getPreviousMonth(month, year);
    $: nextMonth = $ephemeral.getNextMonth(month, year);

    const getMonth = (day: DayOrLeapDay) => {
        if (day.number <= 0)
            return {
                month: previousMonth,
                day: { ...day, number: get(previousMonth.days) + day.number },
                adjacent: true,
            };
        if (day.number > $daysInMonth) {
            return {
                month: nextMonth,
                day: { ...day, number: day.number - $days },
                adjacent: true,
            };
        }
        return {
            month: displayedMonth,
            day,
            adjacent: false,
        };
    };
    
</script>

<div class="week calendarium">
    {#if useCustomWeeks && $displayWeeks}
        <span class="week-number">{displayedWeek.name}</span>
    {:else if useCustomWeeks}
        <span class="week-number">{displayedWeek.abbreviation}</span>
    {:else if $displayWeeks}
        <span class="week-number">{weekNumber}</span>
    {/if}
    {#each dayArray as day}
        {#if day}
            {#if useCustomWeeks}
                <Day {...getMonth(day)} week={displayedWeek}/>
            {:else}
                <Day {...getMonth(day)} />
            {/if}
        {:else}
            <div />
        {/if}
    {/each}
</div>

<style scoped>
    .week {
        display: grid;
        grid-template-columns: repeat(var(--calendar-columns), minmax(0, 1fr));
        text-align: center;
    }
    .week-number {
        border-right: 1px solid var(--blockquote-border-color);
        background-color: transparent;
        padding-bottom: 6px;
        margin-right: 0.25rem;
        color: var(--text-muted);
        font-size: 0.65em;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
