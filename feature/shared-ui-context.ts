import type { Context } from "hydrooj";
import type { ProblemDetailHandler } from "hydrooj/src/handler/problem";

import { getUiContext } from "../common/utils";

export function applySharedUiContext(ctx: Context) {
    ctx.on("handler/after/ProblemDetail#get", (handler: ProblemDetailHandler) => {
        if (handler.pdoc.reference) {
            getUiContext(handler).originalProblemUrl = handler.url("problem_detail", {
                domainId: handler.pdoc.reference.domainId,
                pid: handler.pdoc.reference.pid,
            });
        }
    });
}
