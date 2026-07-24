import { $, addPage, alert, confirm, i18n, NamedPage, Notification, prompt } from "@hydrooj/ui-default";

import { OPER_CHANGE_PROBLEM_ID } from "../common/constants";
import { CE_StringKey } from "../common/strings";
import type { IUiContext } from "../common/types";

addPage(
    new NamedPage(["problem_detail", "contest_detail_problem", "homework_detail_problem"], (pageName) => {
        const { disableEditReferredProblem, originalProblemUrl, isOriginalProblem, pdoc } = UiContext as IUiContext;
        if (disableEditReferredProblem && !isOriginalProblem) {
            $(document).on("click", 'a[href$="/edit"]', (ev) => {
                ev.preventDefault();
                if (originalProblemUrl) {
                    void confirm(i18n(CE_StringKey.ConfirmEditReferredProblem)).then((yes) => {
                        if (yes) {
                            window.location.href = originalProblemUrl;
                        }
                    });
                } else {
                    void alert(i18n(CE_StringKey.AlertEditReferredProblem));
                }
            });

            const editItem = $(".menu__item").has('a[href$="/edit"]');
            editItem.find("span.icon").removeClass("icon-edit").addClass("icon-block");

            if (pageName === "problem_detail" && editItem.length > 0) {
                const button = $(`
                        <button type="button" class="menu__link">
                            <span class="icon icon-edit"></span> ${i18n(CE_StringKey.ChangeProblemId)}
                        </button>
                    `).on("click", () => {
                    void prompt(
                        i18n(CE_StringKey.ChangeProblemId),
                        {
                            pid: {
                                type: "text",
                                label: i18n("pid"),
                                autofocus: true,
                                default: pdoc?.pid,
                            },
                        },
                        {
                            cancelByEsc: true,
                            cancelByClickingBack: false,
                        },
                    )
                        .then((res) => {
                            if (!res) return;
                            if (/^[0-9]+$/.test(res.pid)) {
                                void alert(
                                    i18n(
                                        "Problem ID cannot be a pure number. Leave blank if you want to use numberic id.",
                                    ),
                                );
                                return;
                            }

                            $(`<form method="post" action="${editItem.find("a").attr("href")}">
                                    <input name="operation" value="${OPER_CHANGE_PROBLEM_ID}">
                                </form>`)
                                .append($(`<input name="new_pid">`).val(res.pid))
                                .appendTo(document.body)
                                .trigger("submit")
                                .remove();
                        })
                        .catch((error: Error) => {
                            Notification.error(error?.message);
                        });
                });

                $('<li class="menu__item">').append(button).insertBefore(editItem);
            }
        }
    }),
);
