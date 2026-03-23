import { Schema } from "hydrooj";

import { CE_StringKey } from "../common/strings";

export const enum CE_ConfigKey {
    DisableEditReferredProblem = "disable_edit_referred_problem",
    AllowDistributeProblemChange = "allow_distribute_problem_change_to_other_domains",
}

export const Config = Schema.object({
    [CE_ConfigKey.AllowDistributeProblemChange]: Schema.boolean()
        .default(false)
        .description(CE_StringKey.AllowDistributeProblemChange),
    [CE_ConfigKey.DisableEditReferredProblem]: Schema.boolean()
        .default(false)
        .description(CE_StringKey.DisableEditReferredProblem),
}).description(CE_StringKey.Title);

// eslint-disable-next-line @typescript-eslint/no-require-imports
export const PACKAGE_NAME = (require("../../package.json") as { name: string }).name;
export function getSettingKeys(key: CE_ConfigKey): string {
    return `${PACKAGE_NAME}.${key}`;
}
