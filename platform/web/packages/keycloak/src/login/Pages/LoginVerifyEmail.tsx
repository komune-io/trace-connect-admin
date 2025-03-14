import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Link } from "@komune-io/g2";
import { Stack, Typography } from "@mui/material";

export default function LoginVerifyEmail(props: PageProps<Extract<KcContext, { pageId: "login-verify-email.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { msg, msgStr } = i18n;

    const { url, user } = kcContext;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayInfo
            headerNode={msg("emailVerifyTitle")}
        >
            <Typography>{msgStr("emailVerifyInstruction1", user?.email ?? "")}</Typography>
            <Stack
                gap={1}
                alignItems="center"
            >
                <Typography
                    variant="body2"
                    align="center"
                >
                    {msgStr("emailVerifyInstruction2")}
                </Typography>
                <Link
                    variant="body2"
                    href={url.loginAction}
                    sx={{
                        color: "#828282",
                        textDecoration: "unset !important"
                    }}
                    align="center"
                >

                    <span
                        style={{
                            textDecoration: "underline"
                        }}
                    >
                        {msgStr("doClickHere")}
                    </span>
                    {` ${msgStr("emailVerifyInstruction3")}`}
                </Link>
            </Stack>
        </Template>
    );
}