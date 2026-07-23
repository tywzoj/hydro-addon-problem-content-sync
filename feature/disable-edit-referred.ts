import { type Context, PrivilegeError, ProblemAlreadyExistError, ProblemModel, ValidationError } from "hydrooj";
import type { ProblemDetailHandler } from "hydrooj/src/handler/problem";
import type { ProblemEditHandler } from "hydrooj/src/handler/problem";

import { CE_StringKey } from "../common/strings";
import { getUiContext, isProblemChangeIdOperation, isProblemSyncOperation } from "../common/utils";
import { CE_ConfigKey, getSettingKeys } from "./config";

export function applyDisableEditReferred(ctx: Context) {
    ctx.on("handler/before/ProblemEdit", (handler: ProblemEditHandler) => {
        if (isProblemSyncOperation(handler) || isProblemChangeIdOperation(handler)) {
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

    // We want to reuse the permission checker in ProblemEditHandler,
    // so we implement a operation method into ProblemEditHandler,
    // instead of creating a new route and handler.
    ctx.withHandlerClass("ProblemEditHandler", (HandlerClass) => {
        HandlerClass.prototype.postChangeProblemId = async function ({
            domainId,
            new_pid: pid = "",
        }: {
            domainId: string;
            new_pid?: string;
        }) {
            if (!ctx.setting.get(getSettingKeys(CE_ConfigKey.DisableEditReferredProblem))) {
                return;
            }

            if (typeof pid !== "string" || (pid && !/^(?:[a-z0-9]{1,10}-)?[a-z][a-z0-9]*$/i.test(pid))) {
                throw new ValidationError("new_pid");
            }

            const handler = this as unknown as ProblemEditHandler;

            if (await ProblemModel.get(domainId, pid)) {
                throw new ProblemAlreadyExistError(pid);
            }

            const pdoc = await ProblemModel.edit(domainId, handler.pdoc.docId, { pid });

            handler.response.redirect = handler.url("problem_detail", { domainId, pid: pid || pdoc.docId });
        };

        // The lifecycle is post() -> postChangeProblemId(), so we must override post to skip change problem id operation.
        const originalPost = HandlerClass.prototype.post;
        HandlerClass.prototype.post = function (...args) {
            if (
                ctx.setting.get(getSettingKeys(CE_ConfigKey.DisableEditReferredProblem)) &&
                isProblemChangeIdOperation(this as unknown as ProblemEditHandler)
            ) {
                return;
            }
            return originalPost.apply(this, args);
        };
    });
}
