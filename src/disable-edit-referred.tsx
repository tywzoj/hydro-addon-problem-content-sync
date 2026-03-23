import { Context, PermissionError } from "hydrooj";
import { ProblemDetailHandler, ProblemEditHandler } from "hydrooj/src/handler/problem";
import { CE_ConfigKey, getSettingKeys } from "./config";
import { CE_StringKey } from "./strings";

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
            handler.UiContext.disableEditReferredProblem = ctx.setting.get(getSettingKeys(CE_ConfigKey.DisableEditReferredProblem));
            if (handler.pdoc.reference) {
                handler.UiContext.originalProblemUrl = handler.url("problem_detail", {
                    domainId: handler.pdoc.reference.domainId,
                    pid: handler.pdoc.reference.pid,
                });
            }
    });
}
