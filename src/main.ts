import type { Context } from "hydrooj";

import { applyDisableEditReferred } from "./disable-edit-referred";
import { loadStrings } from "./strings";

export function apply(ctx: Context) {
    loadStrings(ctx);
    applyDisableEditReferred(ctx);
}
