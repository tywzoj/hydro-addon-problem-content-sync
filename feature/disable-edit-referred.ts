import type { Context } from "hydrooj";
import { PermissionError } from "hydrooj";
import type { ProblemDetailHandler, ProblemEditHandler } from "hydrooj/src/handler/problem";

import { CE_StringKey } from "../common/strings";
import { getUiContext } from "../common/utils";
import { CE_ConfigKey, getSettingKeys } from "./config";

export function applyDisableEditReferred(ctx: Context) {
    ctx.on("handler/before/ProblemEdit", (handler: ProblemEditHandler) => {
        if (!ctx.setting.get(getSettingKeys(CE_ConfigKey.DisableEditReferredProblem))) {
            return;
        }
        if (handler.pdoc.reference) {
            throw new PermissionError(CE_StringKey.EditReferredProblem);
        }
    });

    ctx.on("handler/after/ProblemDetail#get", (handler: ProblemDetailHandler) => {
        getUiContext(handler).disableEditReferredProblem = ctx.setting.get(
            getSettingKeys(CE_ConfigKey.DisableEditReferredProblem),
        ) as boolean;
    });
}
