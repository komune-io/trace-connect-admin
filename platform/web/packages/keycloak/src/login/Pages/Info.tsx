import type { PageProps } from "keycloakify/login/pages/PageProps";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Link } from "@komune-io/g2";
import { Typography } from "@mui/material";

export const Info = (props: PageProps<Extract<KcContext, { pageId: "info.ftl" }>, I18n>) => {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { advancedMsgStr, msg } = i18n;

    const { messageHeader, message, requiredActions, skipLink, pageRedirectUri, actionUri, client } = kcContext;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={false}
            headerNode={messageHeader ? kcSanitize(messageHeader) : undefined}
        >
                <Typography
                    dangerouslySetInnerHTML={{
                        __html: kcSanitize(
                            (() => {
                                let html = message.summary + " ";

                                if (requiredActions) {
                                    html += "<b>";

                                    html += requiredActions.map(requiredAction => advancedMsgStr(`requiredAction.${requiredAction}`)).join(", ");

                                    html += "</b>";
                                }

                                return html;
                            })()
                        ) 
                    }}
                />

                {(() => {
                    if (skipLink) {
                        return null;
                    }

                    if (pageRedirectUri) {
                        return (
                            <Link
                                variant="body2"
                                href={pageRedirectUri}
                                sx={{
                                    color: "#828282",
                                }}
                            >
                                {msg("backToApplication")}
                            </Link>
                        );
                    }
                    if (actionUri) {
                        return (
                            <Link
                                variant="body2"
                                href={actionUri}
                                sx={{
                                    color: "#828282",
                                }}
                            >
                                {msg("proceedWithAction")}
                            </Link>
                        );
                    }

                    if (client.baseUrl) {
                        return (
                            <Link
                                variant="body2"
                                href={client.baseUrl}
                                sx={{
                                    color: "#828282",
                                }}
                            >
                                {msg("backToApplication")}
                            </Link>
                        );
                    }
                })()}
        </Template>
    );
}