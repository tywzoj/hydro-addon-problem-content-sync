import type { Context } from "hydrooj";
import { PermissionError } from "hydrooj";
import type { ProblemDetailHandler, ProblemEditHandler } from "hydrooj/src/handler/problem";

import { CE_StringKey } from "../common/strings";
import { getUiContext } from "../common/utils";
import { CE_ConfigKey, getSettingKeys } from "./config";

export function applyDisableEditReferred(ctx: Context) {
    ctx.on("handler/before/ProblemEdit#post", (handler: ProblemEditHandler) => {
        if (!ctx.setting.get(getSettingKeys(CE_ConfigKey.DisableEditReferredProblem))) {
            return;
        }
        if (handler.pdoc.reference) {
            throw new PermissionError(CE_StringKey.EditReferredProblem);
        }
    });

    ctx.on("handler/after/ProblemDetail#get", (handler: ProblemDetailHandler) => {
        const uiContext = getUiContext(handler);
        uiContext.disableEditReferredProblem = ctx.setting.get(
            getSettingKeys(CE_ConfigKey.DisableEditReferredProblem),
        ) as boolean;
        if (handler.pdoc.reference) {
            uiContext.originalProblemUrl = handler.url("problem_detail", {
                domainId: handler.pdoc.reference.domainId,
                pid: handler.pdoc.reference.pid,
            });
        }
    });
}
