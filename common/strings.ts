import type { Context } from "hydrooj";

export const enum CE_StringKey {
    Title = "Problem Content Sync",
    AllowDistributeProblemChange = "Allow distribute problem change to other domains",
    DisableEditReferredProblem = "Disable edit referred problem",
    EditReferredProblem = "Edit referred problem",
    ConfirmEditReferredProblem = "You can not edit a referred problem. Do you want to view the original problem instead?",
}

const strings: Record<string, Record<CE_StringKey, string>> = {
    zh: {
        [CE_StringKey.Title]: "题目内容同步插件",
        [CE_StringKey.AllowDistributeProblemChange]: "允许分发题目变更到其他域",
        [CE_StringKey.DisableEditReferredProblem]: "禁止编辑被引用的题目",
        [CE_StringKey.EditReferredProblem]: "编辑被引用的题目",
        [CE_StringKey.ConfirmEditReferredProblem]: "您不能编辑被引用的题目。是否要查看原始题目？",
    },
    zh_TW: {
        [CE_StringKey.Title]: "題目內容同步插件",
        [CE_StringKey.AllowDistributeProblemChange]: "允許分發題目變更到其他域",
        [CE_StringKey.DisableEditReferredProblem]: "禁止編輯被引用的題目",
        [CE_StringKey.EditReferredProblem]: "編輯被引用的題目",
        [CE_StringKey.ConfirmEditReferredProblem]: "您不能編輯被引用的題目。是否要查看原始題目？",
    },
    en: {
        [CE_StringKey.Title]: "Problem Content Sync",
        [CE_StringKey.AllowDistributeProblemChange]: "Allow distribute problem change to other domains",
        [CE_StringKey.DisableEditReferredProblem]: "Disable edit referred problem",
        [CE_StringKey.EditReferredProblem]: "Edit referred problem",
        [CE_StringKey.ConfirmEditReferredProblem]:
            "You can not edit a referred problem. Do you want to view the original problem instead?",
    },
};

export function loadStrings(ctx: Context) {
    for (const [locale, dict] of Object.entries(strings)) {
        ctx.i18n.load(locale, dict);
    }
}
