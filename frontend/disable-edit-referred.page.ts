import { $, addPage, confirm, i18n, NamedPage } from "@hydrooj/ui-default";

import { CE_StringKey } from "../common/strings";
import type { IUiContext } from "../common/types";

addPage(
    new NamedPage(["problem_detail", "contest_detail_problem", "homework_detail_problem"], () => {
        $(document).on("click", 'a[href$="/edit"]', (ev) => {
            const { disableEditReferredProblem, originalProblemUrl } = UiContext as IUiContext;
            if (disableEditReferredProblem && originalProblemUrl) {
                ev.preventDefault();
                void confirm(i18n(CE_StringKey.ConfirmEditReferredProblem)).then((yes) => {
                    if (yes) {
                        window.location.href = originalProblemUrl;
                    }
                });
            }
        });
    }),
);
