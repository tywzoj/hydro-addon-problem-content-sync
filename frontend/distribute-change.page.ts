import { addPage, i18n, NamedPage } from "@hydrooj/ui-default";

import { ARGS_DISTRIBUTE } from "../common/constants";
import { CE_StringKey } from "../common/strings";
import type { IUiContext } from "../common/types";

addPage(
    new NamedPage(["problem_edit"], () => {
        const { allowDistributeProblemChange, isOriginalProblem } = UiContext as IUiContext;
        if (allowDistributeProblemChange && isOriginalProblem) {
            $(".section__body form").find(".row").last().before(`
<div class="row"><div class="column">
    <label><br>
        <label class="checkbox">
            <input type="checkbox" name="${ARGS_DISTRIBUTE}" value="on" class="checkbox">
            ${i18n(CE_StringKey.DistributeChange)}
        </label>
    </label>
</div></div>`);
        }
    }),
);
