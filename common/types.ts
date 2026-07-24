import type { OPER_CHANGE_PROBLEM_ID, OPER_SYNC_WITH_ORIGINAL_PROBLEM } from "./constants";
import type { SnakeToPascal } from "./utils";

export interface IUiContext {
    disableEditReferredProblem?: boolean;
    originalProblemUrl?: string;
    allowDistributeProblemChange?: boolean;
    isOriginalProblem?: boolean;
    pdoc?: { pid?: string };
}

declare module "hydrooj" {
    interface Context {
        withHandlerClass(
            handlerName: "ProblemEditHandler",
            callback: (HandlerClass: {
                readonly prototype: {
                    [k in
                        | `post${SnakeToPascal<typeof OPER_SYNC_WITH_ORIGINAL_PROBLEM>}`
                        | `post${SnakeToPascal<typeof OPER_CHANGE_PROBLEM_ID>}`
                        | "post"]: (...args: any[]) => unknown;
                };
            }) => void,
        ): void;
    }
}
