import type { Context } from "hydrooj";
import type { ProblemDetailHandler, ProblemEditHandler } from "hydrooj/src/handler/problem";

import { getUiContext } from "../common/utils";

export function applySharedUiContext(ctx: Context) {
    const fn = (handler: ProblemDetailHandler) => {
        const uiContext = getUiContext(handler);
        if (handler.pdoc.reference) {
            uiContext.isOriginalProblem = false;
            uiContext.originalProblemUrl = handler.url("problem_detail", {
                domainId: handler.pdoc.reference.domainId,
                pid: handler.pdoc.reference.pid,
            });
        } else {
            uiContext.isOriginalProblem = true;
        }
    };

    ctx.on("handler/after/ProblemDetail#get", (handler: ProblemDetailHandler) => fn(handler));
    ctx.on("handler/after/ProblemEdit#get", (handler: ProblemEditHandler) => fn(handler));
}
