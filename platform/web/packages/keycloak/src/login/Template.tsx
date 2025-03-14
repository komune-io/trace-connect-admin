// Copy pasted from: https://github.com/InseeFrLab/keycloakify/blob/main/src/login/Template.tsx

import { type TemplateProps } from "keycloakify/login/TemplateProps";
import type { KcContext } from "./KcContext";
import type { I18n } from "./i18n";
import { CssBaseline, Paper, Stack, Typography, styled } from '@mui/material'
import { Alert } from "@komune-io/g2"
import { KeycloakLanguageSelector } from "./KeycloakLanguageSelector";

const Main = styled('main')({
    flexGrow: 1,
    overflow: 'auto',
    display: "flex",
    minHeight: "100vh"
})

export default function Template(props: TemplateProps<KcContext, I18n>) {
    const {
        displayMessage = true,
        kcContext,
        children,
        headerNode,
        i18n,
    } = props;

    const { currentLanguage, enabledLanguages } = i18n;
    const { message, isAppInitiatedAction, } = kcContext;

    return (
        <Main
        sx={{
            background: (theme) => ({
                sm: theme.palette.background.default,
                xs: "white"
            })
        }}
        >
            <CssBaseline />
            <Stack
                flexGrow={1}
                flexBasis={0}
                alignItems="center"
                justifyContent="center"
                sx={{
                    px: {
                        sm: 5,
                        xs: 0
                    },
                    py: {
                        sm: 5,
                        xs: 0
                    },
                    width: "100%",
                }}

            >
                {/* <img
                    alt="Logo Raia"
                    src="/raia-logo.svg"
                    style={{
                        width: "110px"
                    }}
                /> */}
                <Stack
                    sx={{
                        maxWidth: "450px",
                        width: "100%",
                    }}
                    gap={3}
                >
                    {enabledLanguages.length > 1 && (
                        <KeycloakLanguageSelector currentLanguage={currentLanguage} enabledLanguages={enabledLanguages} />
                    )}
                    {displayMessage && message !== undefined && (message.type !== "warning" || !isAppInitiatedAction) && (
                        <Alert
                            sx={{
                                maxWidth: "600px !important",
                                width: "100% !important",
                                bottom: "unset !important",
                                top: "unset !important",
                                left: "unset !important",
                                right: "unset !important",
                                zIndex: 1,
                                "& .MuiSnackbarContent-root": {
                                    boxShadow: (theme) => theme.shadows[1],
                                }
                            }}
                            severity={message.type}
                            isRelative
                            colorBase='light'
                        >
                            {message.summary}
                        </Alert>
                    )}
                    <Paper
                        sx={{
                            // position: "relative",
                            maxWidth: "450px",
                            width: "100%",
                            borderRadius: 1.5,
                            display: "flex",
                            flexDirection: "column",
                            gap: 4,
                            px: {
                                sm: 6,
                                xs: 2
                            },
                            py: {
                                sm: 4,
                                xs: 2
                            },
                            boxShadow: {
                                sm: 1,
                                xs: 0
                            }
                        }}

                    >
                        {headerNode && <Typography sx={{ color: "primary.main", alignSelf: "center" }} align="center" variant="subtitle1">{headerNode}</Typography>}
                        {children}
                    </Paper>
                </Stack>
            </Stack>
        </Main >
    );
}
