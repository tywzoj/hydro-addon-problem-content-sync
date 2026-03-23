import { $, addPage, confirm, i18n, NamedPage } from "@hydrooj/ui-default";
import { CE_StringKey } from "src/strings";

addPage(
    new NamedPage(["problem_detail"], () => {
        $(document).on("click", 'a[href$="/edit"]', (ev) => {
            const { disableEditReferredProblem, originalProblemUrl } = UiContext as {
                disableEditReferredProblem?: boolean;
                originalProblemUrl?: string;
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
