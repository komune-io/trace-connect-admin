import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { KcPage } from "./kc.gen";

// The following block can be uncommented to test a specific page with `yarn dev`
// Don't forget to comment back or your bundle size will increase

import { getKcContextMock } from "./login/KcPageStory";
import { AlertHub, AppProvider, G2ConfigBuilder, initI18next, ThemeContextProvider } from "@komune-io/g2";
import { muiTheme, theme } from "./Themes";
import { QueryClient } from "@tanstack/react-query";

//@ts-ignore
G2ConfigBuilder(window._env_)

if (import.meta.env.DEV) {
    window.kcContext = getKcContextMock({
        pageId: "login-page-expired.ftl",
        overrides: {
            locale: {
                currentLanguageTag: "fr"
            }
        }
    });
}

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 86400000 //stale time set to one day
        }
    }
})

const i18n = initI18next({ en: "en-US", fr: 'fr-FR', es: "es-ES" })
i18n.addResourceBundle(
    'fr',
    'translation',
    {
        http: {
            backendErrors: {
                "2000": "L'adresse e-mail indiquée correspond déjà à un compte existant",
                "2002": "L'entreprise que vous avez saisie est déjà enregistrée sur la plateforme."
            },
            errors: {
                "identity/userOnboard": "Votre compte n'a pas pu être créé",
            },
            success: {
                "identity/userOnboard": "Votre compte a bien été créé",
            }
        }
    },
    true,
    false
)

i18n.addResourceBundle(
    'en',
    'translation',
    {
        http: {
            backendErrors: {
                "2000": "The email address entered already corresponds to an existing account.",
                "2002": "The company you entered is already integrated into the platform"
            },
            errors: {
                "identity/userOnboard": "Your account could not be created",
            },
            success: {
                "identity/userOnboard": "Your account has been successfully created",
            }
        }
    },
    true,
    false
)

i18n.addResourceBundle(
    'es',
    'translation',
    {
        http: {
            backendErrors: {
                "2000": "El correo electrónico proporcionado ya corresponde a una cuenta existente",
                "2002": "La empresa que ingresaste ya está integrada en la plataforma"
            },
            errors: {
                "identity/userOnboard": "No se pudo crear tu cuenta",
            },
            success: {
                "identity/userOnboard": "Tu cuenta ha sido creada con éxito",
            }
        }
    },
    true,
    false
)


createRoot(document.getElementById("root")!).render(
    <StrictMode>
        {!window.kcContext ? (
            <h1>No Keycloak Context</h1>
        ) : (
            // @ts-ignore
            <ThemeContextProvider theme={theme} customMuiTheme={muiTheme} >
                <AlertHub>
                    <AppProvider i18nOverride={i18n} queryClient={queryClient}>
                        <KcPage kcContext={window.kcContext} />
                    </AppProvider>
                </AlertHub >
            </ThemeContextProvider>

        )}
    </StrictMode>
);
