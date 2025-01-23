import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { KcPage } from "./kc.gen";

// The following block can be uncommented to test a specific page with `yarn dev`
// Don't forget to comment back or your bundle size will increase

import { getKcContextMock } from "./login/KcPageStory";
import { initI18next, ThemeContextProvider } from "@komune-io/g2";
import { I18nextProvider } from "react-i18next";
import { theme } from "./Themes";

if (import.meta.env.DEV) {
    window.kcContext = getKcContextMock({
        pageId: "login-reset-password.ftl",
        overrides: {}
    });
}

const i18n = initI18next({ en: "en-US", fr: 'fr-FR' })

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        {!window.kcContext ? (
            <h1>No Keycloak Context</h1>
        ) : (
            <ThemeContextProvider theme={theme}>
                <I18nextProvider i18n={i18n}>
                    <KcPage kcContext={window.kcContext} />
                </I18nextProvider>
            </ThemeContextProvider>

        )}
    </StrictMode>
);
