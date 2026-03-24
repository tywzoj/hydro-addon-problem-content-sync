import type { Context } from "hydrooj";

export const enum CE_StringKey {
    Title = "Problem Content Sync",
    AllowDistributeProblemChange = "Allow distribute problem change to other domains",
    DisableEditReferredProblem = "Disable edit referred problem",
    EditReferredProblem = "Edit referred problem",
    ConfirmEditReferredProblem = "You are not allowed to edit a referred problem. Do you want to view the original problem instead?",
    DistributeChange = "Distribute change to referred problems in other domains",
    DistributeChangeNotice = "Problem {0} in domain {1} has been updated due to changes in the original problem.",
    DistributeChangeSkipNotice = "Problem {0} in domain {1} is skipped for distribution because its domain isn't allowed to refer the original problem.",
    DistributeChangeNoPrivilege = "You don't have permission to distribute problem changes.",
    SyncWithOriginalProblem = "Sync with original problem",
    ConfirmSyncWithOriginalProblem = "Are you sure you want to sync with the original problem? This will overwrite the current problem content.",
}

const strings: Record<string, Record<CE_StringKey, string>> = {
    zh: {
        [CE_StringKey.Title]: "题目内容同步插件",
        [CE_StringKey.AllowDistributeProblemChange]: "允许分发题目变更到其他域",
        [CE_StringKey.DisableEditReferredProblem]: "禁止编辑被引用的题目",
        [CE_StringKey.EditReferredProblem]: "编辑被引用的题目",
        [CE_StringKey.ConfirmEditReferredProblem]: "您不被允许编辑被引用的题目。是否要查看原始题目？",
        [CE_StringKey.DistributeChange]: "分发变更到其他域的被引用题目",
        [CE_StringKey.DistributeChangeNotice]: "在域 {1} 的题目 {0} 中已因原始题目的更改而更新。",
        [CE_StringKey.DistributeChangeSkipNotice]: "在域 {1} 的题目 {0} 被跳过分发，因为其域不被允许引用原始题目。",
        [CE_StringKey.SyncWithOriginalProblem]: "与原题同步",
        [CE_StringKey.ConfirmSyncWithOriginalProblem]: "您确定要与原题同步吗？这将覆盖当前题目的内容。",
        [CE_StringKey.DistributeChangeNoPrivilege]: "您没有权限分发题目变更。",
    },
    zh_TW: {
        [CE_StringKey.Title]: "題目內容同步插件",
        [CE_StringKey.AllowDistributeProblemChange]: "允許分發題目變更到其他域",
        [CE_StringKey.DisableEditReferredProblem]: "禁止編輯被引用的題目",
        [CE_StringKey.EditReferredProblem]: "編輯被引用的題目",
        [CE_StringKey.ConfirmEditReferredProblem]: "您不被允許編輯被引用的題目。是否要查看原始題目？",
        [CE_StringKey.DistributeChange]: "分發變更到其他域的被引用題目",
        [CE_StringKey.DistributeChangeNotice]: "在域 {1} 的題目 {0} 中已因原始題目的更改而更新。",
        [CE_StringKey.DistributeChangeSkipNotice]: "在域 {1} 的題目 {0} 被跳過分發，因為其域不被允許引用原始題目。",
        [CE_StringKey.SyncWithOriginalProblem]: "與原題同步",
        [CE_StringKey.ConfirmSyncWithOriginalProblem]: "您確定要與原題同步嗎？這將覆蓋當前題目的內容。",
        [CE_StringKey.DistributeChangeNoPrivilege]: "您沒有權限分發題目變更。",
    },
};

export function loadStrings(ctx: Context) {
    for (const [locale, dict] of Object.entries(strings)) {
        ctx.i18n.load(locale, dict);
    }
}
