import type { Context } from "hydrooj";
import { MessageModel, ProblemModel } from "hydrooj";
import type { ProblemEditHandler } from "hydrooj/src/handler/problem";

import { ARGS_DISTRIBUTE } from "../common/constants";
import { CE_StringKey } from "../common/strings";
import { buildProblemContentUpdate, getUiContext } from "../common/utils";
import { CE_ConfigKey, getSettingKeys } from "./config";

export function applyDistributeChange(ctx: Context) {
    ctx.on("handler/after/ProblemEdit#post", async (handler: ProblemEditHandler) => {
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
            await MessageModel.sendInfo(
                handler.user._id,
                JSON.stringify({
                    message: CE_StringKey.DistributeChangeNotice,
                    params: [pdoc.pid, pdoc.domainId],
                }),
            );
        }
    });

    ctx.on("handler/after/ProblemEdit#get", (handler: ProblemEditHandler) => {
        const uiContext = getUiContext(handler);
        uiContext.allowDistributeProblemChange = ctx.setting.get(
            getSettingKeys(CE_ConfigKey.AllowDistributeProblemChange),
        ) as boolean;
        uiContext.isOriginalProblem = !handler.pdoc.reference;
    });
}
