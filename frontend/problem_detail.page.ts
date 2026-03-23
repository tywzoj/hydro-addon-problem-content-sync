import { $, addPage, confirm, i18n, NamedPage } from "@hydrooj/ui-default";

import { UI_CONTEXT_DISABLE_EDIT_REFERRED_PROBLEM, UI_CONTEXT_ORIGINAL_PROBLEM_URL } from "../common/constants";
import { CE_StringKey } from "../common/strings";

addPage(
    new NamedPage(["problem_detail"], () => {
        $(document).on("click", 'a[href$="/edit"]', (ev) => {
            const {
                [UI_CONTEXT_DISABLE_EDIT_REFERRED_PROBLEM]: disableEditReferredProblem,
                [UI_CONTEXT_ORIGINAL_PROBLEM_URL]: originalProblemUrl,
            } = UiContext as {
                [UI_CONTEXT_DISABLE_EDIT_REFERRED_PROBLEM]?: boolean;
                [UI_CONTEXT_ORIGINAL_PROBLEM_URL]?: string;
            };
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
