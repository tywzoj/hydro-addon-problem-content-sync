import { addPage, confirm, i18n, NamedPage } from "@hydrooj/ui-default";

import { OPER_SYNC_WITH_ORIGINAL_PROBLEM } from "../common/constants";
import { CE_StringKey } from "../common/strings";
import type { IUiContext } from "../common/types";

addPage(
    new NamedPage(["problem_detail", "contest_detail_problem", "homework_detail_problem"], () => {
        const { isOriginalProblem } = UiContext as IUiContext;
        if (!isOriginalProblem) {
            const editItem = $(".menu__item").has('a[href*="/edit"]');
            if (editItem.length > 0) {
                const form = $(`
                    <form method="post" action="${editItem.find("a").attr("href")}">
                        <input type="hidden" name="operation" value="${OPER_SYNC_WITH_ORIGINAL_PROBLEM}">
                        <button type="submit" class="menu__link">
                            <span class="icon icon-refresh"></span> ${i18n(CE_StringKey.SyncWithOriginalProblem)}
                        </button>
                    </form>
                `).on("submit", (ev) => {
                    ev.preventDefault();
                    void confirm(i18n(CE_StringKey.ConfirmSyncWithOriginalProblem)).then((yes) => {
                        if (yes) $(ev.currentTarget).off("submit").trigger("submit");
                    });
                });

                $('<li class="menu__item">').add(form).insertAfter(editItem);
            }
        }
    }),
);
