<script lang="ts">
    import { getContext } from "svelte";
    import type { NamedWeek } from "src/schemas/calendar/timespans";
    import SettingItem from "src/settings/creator/Settings/SettingItem.svelte";
    import { setNodeIcon } from "src/utils/icons";
    import { MONTH } from "src/utils/icons";

    export let item: NamedWeek;
    const store = getContext("store");
    let icon = MONTH;
    let label = "Week";
</script>

<SettingItem>
    <div slot="name">{item.name}</div>
    <div slot="desc" class="desc">
        <div use:setNodeIcon={icon} aria-label={label} />
        <span> {item.abbreviation ?? item.name?.substring(0,3).toUpperCase()} </span>
    </div>
</SettingItem>

<style>
    .desc {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
</style>
