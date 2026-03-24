import type { Context } from "hydrooj";

import { loadStrings } from "./common/strings";
import { applyDisableEditReferred } from "./feature/disable-edit-referred";
import { applyDistributeChange } from "./feature/distribute-change";

export { Config } from "./feature/config";

export function apply(ctx: Context) {
    loadStrings(ctx);
    applyDisableEditReferred(ctx);
    applyDistributeChange(ctx);
}
