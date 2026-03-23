import type { Context } from "hydrooj";
import { ProblemModel } from "hydrooj";
import type { ProblemEditHandler } from "hydrooj/src/handler/problem";

import { ARGS_DISTRIBUTE, UI_CONTEXT_ALLOW_DISTRIBUTE_PROBLEM_CHANGE } from "../common/constants";
import { buildProblemContentUpdate } from "../common/utils";
import { CE_ConfigKey, getSettingKeys } from "./config";

export function applyDistributeChange(ctx: Context) {
    ctx.on("handler/after/ProblemEditHandler#post", async (handler: ProblemEditHandler) => {
        if (!ctx.setting.get(getSettingKeys(CE_ConfigKey.AllowDistributeProblemChange))) {
            return;
        }
        if (!handler.args[ARGS_DISTRIBUTE]) return;

        // The problem document has been updated, but handler.pdoc is not updated yet,
        // so we need to get the latest problem document here.
        const pdoc = (await ProblemModel.get(handler.pdoc.domainId, handler.pdoc.docId))!;

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const cursor = ProblemModel.getMulti(undefined /* do not set domainId filter */, {
            reference: {
                domainId: pdoc.domainId,
                pid: pdoc.docId,
            },
        });

        for await (const pdoc of cursor) {
            await ProblemModel.edit(pdoc.domainId, pdoc.docId, buildProblemContentUpdate(pdoc));
        }
    });

    ctx.on("handler/after/ProblemEditHandler#get", (handler: ProblemEditHandler) => {
        handler.UiContext[UI_CONTEXT_ALLOW_DISTRIBUTE_PROBLEM_CHANGE] = ctx.setting.get(
            getSettingKeys(CE_ConfigKey.AllowDistributeProblemChange),
        ) as boolean;
    });
}
