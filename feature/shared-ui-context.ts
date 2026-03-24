import type { Context } from "hydrooj";
import type { ProblemDetailHandler, ProblemEditHandler } from "hydrooj/src/handler/problem";

import { getUiContext } from "../common/utils";

export function applySharedUiContext(ctx: Context) {
    const fn = (handler: ProblemDetailHandler) => {
        getUiContext(handler).isOriginalProblem = !handler.pdoc.reference;
    };

    ctx.on("handler/after/ProblemDetail#get", (handler: ProblemDetailHandler) => fn(handler));
    ctx.on("handler/after/ProblemEdit#get", (handler: ProblemEditHandler) => fn(handler));
}
