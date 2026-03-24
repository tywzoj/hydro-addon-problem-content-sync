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
                $(`
                    <li class="menu__item">
                        <form method="post" action="${editItem.find("a").attr("href")}">
                            <input type="hidden" name="operation" value="${OPER_SYNC_WITH_ORIGINAL_PROBLEM}">
                            <button type="submit" class="menu__link" name="problem-sidebar__${OPER_SYNC_WITH_ORIGINAL_PROBLEM}">
                                <span class="icon icon-refresh"></span> ${i18n(CE_StringKey.SyncWithOriginalProblem)}
                            </button>
                        </form>
                    </li>
                `).insertAfter(editItem);

                $(document).on(
                    "submit",
                    `form button[name="problem-sidebar__${OPER_SYNC_WITH_ORIGINAL_PROBLEM}"]`,
                    (ev) => {
                        ev.preventDefault();
                        void confirm(i18n(CE_StringKey.ConfirmSyncWithOriginalProblem)).then((yes) => {
                            if (yes) $(ev.currentTarget).closest("form").trigger("submit");
                        });
                    },
                );
            }
        }
    }),
);
