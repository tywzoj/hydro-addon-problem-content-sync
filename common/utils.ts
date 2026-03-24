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

export type SnakeToPascal<S extends string> = S extends `${infer Head}_${infer Tail}`
    ? `${Capitalize<Head>}${SnakeToPascal<Tail>}`
    : Capitalize<S>;
