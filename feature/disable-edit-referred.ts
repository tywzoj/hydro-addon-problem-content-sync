import type { Context } from "hydrooj";
import { PrivilegeError } from "hydrooj";
import type { ProblemDetailHandler, ProblemEditHandler } from "hydrooj/src/handler/problem";

import { OPER_SYNC_WITH_ORIGINAL_PROBLEM } from "../common/constants";
import { CE_StringKey } from "../common/strings";
import { getUiContext } from "../common/utils";
import { CE_ConfigKey, getSettingKeys } from "./config";

export function applyDisableEditReferred(ctx: Context) {
    ctx.on("handler/before/ProblemEdit", (handler: ProblemEditHandler) => {
        if (
            handler.request.method === "post" &&
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            handler.request.body?.operation === OPER_SYNC_WITH_ORIGINAL_PROBLEM
        ) {
            // Allow syncing content even if editing referred problem is disabled.
            return;
        }

        if (!ctx.setting.get(getSettingKeys(CE_ConfigKey.DisableEditReferredProblem))) {
            return;
        }
        if (handler.pdoc.reference) {
            throw new PrivilegeError(CE_StringKey.EditReferredProblem);
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
