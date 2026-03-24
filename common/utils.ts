import type { Handler } from "hydrooj";
import { type ProblemDoc } from "hydrooj";

import type { IUiContext } from "./types";

export function buildProblemContentUpdate(source: ProblemDoc): Partial<ProblemDoc> {
    return {
        title: source.title,
        content: source.content,
        tag: source.tag,
    };
}

export function getUiContext(handler: Handler): IUiContext {
    return (handler.UiContext ??= {} as IUiContext);
}

export function isProblemSyncOperation(handler: Handler): boolean {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return handler.request.method === "post" && handler.request.body.operation === "sync_with_original_problem";
}

export type SnakeToPascal<S extends string> = S extends `${infer Head}_${infer Tail}`
    ? `${Capitalize<Head>}${SnakeToPascal<Tail>}`
    : Capitalize<S>;
