import type { Context } from "hydrooj";

import { loadStrings } from "./strings";

export function apply(ctx: Context) {
    loadStrings(ctx);
}
