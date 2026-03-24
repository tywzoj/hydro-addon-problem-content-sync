import { BadRequestError, type Context, ProblemModel, ProblemNotFoundError } from "hydrooj";
import { ProblemEditHandler } from "hydrooj/src/handler/problem";

import { buildProblemContentUpdate } from "../common/utils";

declare module "hydrooj" {
    class ProblemEditHandlerWithSync extends ProblemEditHandler {
        postSyncWithOriginalProblem: () => Promise<void>;
    }

    interface Context {
        withHandlerClass(
            handlerName: "ProblemEditHandler",
            callback: (handler: typeof ProblemEditHandlerWithSync) => void,
        ): void;
    }
}

export function applyProblemContentSync(ctx: Context) {
    ctx.withHandlerClass("ProblemEditHandler", (Handler) => {
        Handler.prototype.postSyncWithOriginalProblem = async function () {
            const handler = this as InstanceType<typeof Handler>;

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
