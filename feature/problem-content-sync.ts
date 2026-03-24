import { BadRequestError, type Context, ProblemModel, ProblemNotFoundError } from "hydrooj";
import type { ProblemEditHandler } from "hydrooj/src/handler/problem";

import type { OPER_SYNC_WITH_ORIGINAL_PROBLEM } from "../common/constants";
import type { SnakeToPascal } from "../common/utils";
import { buildProblemContentUpdate, isProblemSyncOperation } from "../common/utils";

declare module "hydrooj" {
    interface Context {
        withHandlerClass(
            handlerName: "ProblemEditHandler",
            callback: (HandlerClass: {
                readonly prototype: {
                    [k in
                        | `post${SnakeToPascal<typeof OPER_SYNC_WITH_ORIGINAL_PROBLEM>}`
                        | "post"]: () => Promise<void> | void;
                };
            }) => void,
        ): void;
    }
}

export function applyProblemContentSync(ctx: Context) {
    ctx.withHandlerClass("ProblemEditHandler", (HandlerClass) => {
        const originalPost = HandlerClass.prototype.post;
        HandlerClass.prototype.post = function (...args) {
            if (isProblemSyncOperation(this as ProblemEditHandler)) return;
            return originalPost.apply(this, args);
        };
        HandlerClass.prototype.postSyncWithOriginalProblem = async function () {
            const handler = this as ProblemEditHandler;

            if (!handler.pdoc.reference) {
                throw new BadRequestError("This problem does not reference another problem.");
            }

            const ori_pdoc = await ProblemModel.get(handler.pdoc.reference.domainId, handler.pdoc.reference.pid);

            if (!ori_pdoc) {
                throw new ProblemNotFoundError(handler.pdoc.reference.domainId, handler.pdoc.reference.pid);
            }

            await ProblemModel.edit(handler.pdoc.domainId, handler.pdoc.docId, buildProblemContentUpdate(ori_pdoc));

            handler.back();
        };
    });
}
