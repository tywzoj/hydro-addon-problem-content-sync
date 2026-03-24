import type { Context } from "hydrooj";

import { loadStrings } from "./common/strings";
import { applyDisableEditReferred } from "./feature/disable-edit-referred";
import { applyDistributeChange } from "./feature/distribute-change";
import { applyProblemContentSync } from "./feature/problem-content-sync";
import { applySharedUiContext } from "./feature/shared-ui-context";

export { Config } from "./feature/config";

export function apply(ctx: Context) {
    loadStrings(ctx);
    applySharedUiContext(ctx);

    applyProblemContentSync(ctx);
    applyDisableEditReferred(ctx);
    applyDistributeChange(ctx);
}
