import type { Context } from "hydrooj";
import { PermissionError } from "hydrooj";
import type { ProblemDetailHandler, ProblemEditHandler } from "hydrooj/src/handler/problem";

import { UI_CONTEXT_DISABLE_EDIT_REFERRED_PROBLEM, UI_CONTEXT_ORIGINAL_PROBLEM_URL } from "../common/constants";
import { CE_StringKey } from "../common/strings";
import { CE_ConfigKey, getSettingKeys } from "./config";

export function applyDisableEditReferred(ctx: Context) {
    ctx.on("handler/before/ProblemEditHandler", (handler: ProblemEditHandler) => {
        if (!ctx.setting.get(getSettingKeys(CE_ConfigKey.DisableEditReferredProblem))) {
            return;
        }
        if (handler.pdoc.reference) {
            throw new PermissionError(CE_StringKey.EditReferredProblem);
        }
    });

    ctx.on("handler/after/ProblemDetailHandler#get", (handler: ProblemDetailHandler) => {
        handler.UiContext[UI_CONTEXT_DISABLE_EDIT_REFERRED_PROBLEM] = ctx.setting.get(
            getSettingKeys(CE_ConfigKey.DisableEditReferredProblem),
        ) as boolean;
        if (handler.pdoc.reference) {
            handler.UiContext[UI_CONTEXT_ORIGINAL_PROBLEM_URL] = handler.url("problem_detail", {
                domainId: handler.pdoc.reference.domainId,
                pid: handler.pdoc.reference.pid,
            });
        }
    });
}
