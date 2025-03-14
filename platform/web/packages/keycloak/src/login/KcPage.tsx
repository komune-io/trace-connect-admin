import { Suspense, lazy, useEffect } from "react";
import type { ClassKey } from "keycloakify/login";
import type { KcContext } from "./KcContext";
import { useI18n } from "./i18n";
import DefaultPage from "keycloakify/login/DefaultPage";
import DefaultTemplate from "keycloakify/login/Template";
import {Info, Login, LoginResetPassword, LoginUpdatePassword} from "./Pages";
import Template from "./Template"
import { useTranslation } from "react-i18next";
import LoginOtp from "./Pages/LoginOtp.tsx";
import LoginConfigTotp from "./Pages/LoginConfigTotp.tsx";
import LoginVerifyEmail from "./Pages/LoginVerifyEmail.tsx";
import Error from "./Pages/Error.tsx";
import LoginPageExpired from "./Pages/LoginPageExpired.tsx";
import LogoutConfirm from "./Pages/LogoutConfirm.tsx";

const UserProfileFormFields = lazy(
    () => import("keycloakify/login/UserProfileFormFields")
);

const doMakeUserConfirmPassword = true;

export default function KcPage(props: { kcContext: KcContext }) {
    const { kcContext } = props;

    const { i18n } = useI18n({ kcContext });
    const {i18n: g2I18n } = useTranslation()

    useEffect(() => {
        if (i18n.currentLanguage.languageTag !== g2I18n.language) {
            g2I18n.changeLanguage(i18n.currentLanguage.languageTag)
        }

    }, [i18n.currentLanguage, g2I18n.language])

    return (
        <Suspense>
            {(() => {
                switch (kcContext.pageId) {
                    case "error.ftl": return <Error {...{ kcContext, i18n, classes }} Template={Template} doUseDefaultCss={true} />
                    case "info.ftl": return <Info {...{ kcContext, i18n, Template, classes }} doUseDefaultCss={true} />;
                    case "login.ftl": return <Login {...{ kcContext, i18n, classes }} Template={Template} doUseDefaultCss={true} />
                    case "login-config-totp.ftl": return <LoginConfigTotp {...{ kcContext, i18n, classes }} Template={Template} doUseDefaultCss={true} />
                    case "login-otp.ftl": return <LoginOtp {...{ kcContext, i18n, classes }} Template={Template} doUseDefaultCss={true} />
                    case "login-page-expired.ftl": return <LoginPageExpired {...{ kcContext, i18n, classes }} Template={Template} doUseDefaultCss={true} />
                    case "login-reset-password.ftl": return <LoginResetPassword {...{ kcContext, i18n, Template, classes }} doUseDefaultCss={true} />;
                    case "login-update-password.ftl": return <LoginUpdatePassword {...{ kcContext, i18n, Template, classes }} doUseDefaultCss={true} />;
                    case "login-verify-email.ftl": return <LoginVerifyEmail {...{ kcContext, i18n, Template, classes }} doUseDefaultCss={true} />;
                    case "logout-confirm.ftl": return <LogoutConfirm {...{ kcContext, i18n, Template, classes }} doUseDefaultCss={true} />;
                    default:
                        return (
                            <DefaultPage
                                kcContext={kcContext}
                                i18n={i18n}
                                classes={classes}
                                Template={DefaultTemplate}
                                doUseDefaultCss={true}
                                UserProfileFormFields={UserProfileFormFields}
                                doMakeUserConfirmPassword={doMakeUserConfirmPassword}
                            />
                        );
                }
            })()}
        </Suspense>
    );
}

const classes = {} satisfies { [key in ClassKey]?: string };
