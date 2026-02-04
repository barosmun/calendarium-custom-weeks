<script lang="ts">
    import { getContext } from "svelte";
    import WeekInstance from "./WeekInstance.svelte";
    import copy from "fast-copy";
    import type { NamedWeek } from "src/schemas/calendar/timespans";
    import { WeekModal } from "src/settings/creator/Containers/dates/weeks/week";
    import AddNew from "src/settings/creator/Utilities/AddNew.svelte";
    import Details from "src/settings/creator/Utilities/Details.svelte";
    import DropZone from "src/settings/creator/Utilities/DropZone.svelte";
    import NoExistingItems from "src/settings/creator/Utilities/NoExistingItems.svelte";
    import ToggleComponent from "src/settings/creator/Settings/ToggleComponent.svelte";
    import { Platform } from "obsidian";

    const store = getContext("store");
    const { namedWeekStore, staticStore } = store;
    const { customWeeks } = namedWeekStore;
    $: items = copy($namedWeekStore);

    function onDrop(items: NamedWeek[]) {
        namedWeekStore.set(items);
    }
    const advanced = (item: NamedWeek) => {
        const modal = new WeekModal(item);
        modal.onCancel = () => {}; //no op;
        modal.onClose = () => {
            if (!modal.item.name || !item.id) return;
            namedWeekStore.update(item.id, modal.item);
        };
        modal.open();
    };

    const toggleCustom = () => {
        staticStore.setProperty("useCustomWeeks", !$staticStore.useCustomWeeks);
    };

    const trash = (item: NamedWeek) => {
        namedWeekStore.delete(item.id ?? "");
    };
</script>

<Details
    name={"Weeks"}
    open={Platform.isDesktop}
    warn={$customWeeks && !$namedWeekStore?.length}
    label={"At least one week is required"}
    desc={`${$namedWeekStore?.length} week${$namedWeekStore?.length != 1 ? "s" : ""}`}
>
    <ToggleComponent
        name="Use custom weeks"
        value={$customWeeks ?? false}
        on:click={() => toggleCustom()}
    />

    {#if $customWeeks}

        {#if !$namedWeekStore?.length}
            <NoExistingItems message={"Create a new week to see it here."} />
        {:else}
            <DropZone
                type="week"
                component={WeekInstance}
                {items}
                {onDrop}
                on:advanced={(e) => advanced(e.detail)}
                on:trash={(e) => trash(e.detail)}
            />
        {/if}

        <AddNew
            placeholder={"Week"}
            on:add={(evt) => namedWeekStore.add(evt.detail)}
        />

    {/if}
</Details>

<style>
</style>
