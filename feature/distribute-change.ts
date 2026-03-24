import type { Context } from "hydrooj";
import { PermissionError, PRIV, ProblemModel } from "hydrooj";
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

        // It is not easy to check the permission for each referred problem in other domains,
        // so we only allow users with MANAGE_ALL_DOMAIN privilege to perform distribute change operation.
        if (!handler.user.hasPriv(PRIV.PRIV_MANAGE_ALL_DOMAIN)) {
            throw new PermissionError(CE_StringKey.DistributeChangeNoPrivilege);
        }

        // The problem document has been updated, but handler.pdoc is not updated yet,
        // so we need to get the latest problem document here.
        const ori_pdoc = (await ProblemModel.get(handler.pdoc.domainId, handler.pdoc.docId))!;

        const cursor = ProblemModel.getMulti(
            "" /* will be overridden by query */,
            {
                domainId: { $exists: true },
                reference: {
                    domainId: ori_pdoc.domainId,
                    pid: ori_pdoc.docId,
                },
            },
            ["domainId", "docId", "pid"],
        );

        const t = `,${handler.domain.share || ""},`;
        for await (const pdoc of cursor) {
            if (t !== ",*," && !t.includes(`,${handler.pdoc.domainId},`)) {
                handler.progress(CE_StringKey.DistributeChangeSkipNotice, [pdoc.pid, pdoc.domainId]);
                continue;
            }
            await ProblemModel.edit(pdoc.domainId, pdoc.docId, buildProblemContentUpdate(ori_pdoc));
            handler.progress(CE_StringKey.DistributeChangeNotice, [pdoc.pid, pdoc.domainId]);
        }
    });

    ctx.on("handler/after/ProblemEdit#get", (handler: ProblemEditHandler) => {
        getUiContext(handler).allowDistributeProblemChange =
            (ctx.setting.get(getSettingKeys(CE_ConfigKey.AllowDistributeProblemChange)) as boolean) &&
            handler.user.hasPriv(PRIV.PRIV_MANAGE_ALL_DOMAIN);
    });
}
