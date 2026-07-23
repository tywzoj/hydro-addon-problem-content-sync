import {
    BadRequestError,
    type Context,
    DomainModel,
    ProblemModel,
    ProblemNotAllowCopyError,
    ProblemNotFoundError,
} from "hydrooj";
import type { ProblemEditHandler } from "hydrooj/src/handler/problem";

import { buildProblemContentUpdate, isProblemSyncOperation } from "../common/utils";

export function applyProblemContentSync(ctx: Context) {
    // We want to reuse the permission checker in ProblemEditHandler,
    // so we implement a operation method into ProblemEditHandler,
    // instead of creating a new route and handler.
    ctx.withHandlerClass("ProblemEditHandler", (HandlerClass) => {
        HandlerClass.prototype.postSyncWithOriginalProblem = async function () {
            const handler = this as unknown as ProblemEditHandler;

            if (!handler.pdoc.reference) {
                throw new BadRequestError("This problem does not reference another problem.");
            }

            const ori_pdoc = await ProblemModel.get(handler.pdoc.reference.domainId, handler.pdoc.reference.pid);
            const ori_ddoc = await DomainModel.get(handler.pdoc.reference.domainId);

            if (!ori_pdoc || !ori_ddoc) {
                throw new ProblemNotFoundError(handler.pdoc.reference.domainId, handler.pdoc.reference.pid);
            }

            const t = `,${ori_ddoc.share || ""},`;
            if (t !== ",*," && !t.includes(`,${handler.pdoc.domainId},`)) {
                throw new ProblemNotAllowCopyError(ori_pdoc.domainId, handler.pdoc.domainId);
            }

            await ProblemModel.edit(handler.pdoc.domainId, handler.pdoc.docId, buildProblemContentUpdate(ori_pdoc));

            handler.back();
        };

        // The lifecycle is post() -> postSyncWithOriginalProblem(), so we must override post to skip sync operation.
        const originalPost = HandlerClass.prototype.post;
        HandlerClass.prototype.post = function (...args) {
            const handler = this as unknown as ProblemEditHandler;
            if (isProblemSyncOperation(handler)) return;
            return originalPost.apply(this, args);
        };
    });
}
