import { CanceableCalendariumModal } from "../../../../modals/modal";
import { Setting } from "obsidian";
import type { NamedWeek } from "src/schemas/calendar/timespans";
import { nanoid } from "src/utils/functions";

export class WeekModal extends CanceableCalendariumModal<NamedWeek> {
    creating: boolean;

    constructor(item?: NamedWeek) {
        super();
        if (!item) {
            this.creating = true;
        }

        this.item = item ?? {
            type: "week",
            name: "",
            id: nanoid(6),
        };

        this.titleEl.setText(`${this.creating ? "Create" : "Modify"} week`);
    }
    async display() {
        this.contentEl.empty();
        new Setting(this.contentEl).setName("Name").addText((t) => {
            t.setValue(this.item.name ?? "").onChange(
                (v) => (this.item.name = v)
            );
        });
        new Setting(this.contentEl).setName("Abbreviation").addText((t) => {
            t.setValue(this.item.abbreviation ?? "").onChange(
                (v) => (this.item.abbreviation = v)
            );
        });
    }
}
