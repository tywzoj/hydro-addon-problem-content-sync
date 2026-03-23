import { type ProblemDoc } from "hydrooj";

export function buildProblemContentUpdate(source: ProblemDoc): Partial<ProblemDoc> {
    return {
        title: source.title,
        content: source.content,
        tag: source.tag,
    };
}
