// ejected using 'npx eject-keycloak-page'
import { useState, useMemo, type FormEventHandler } from "react";
import { useConstCallback } from "keycloakify/tools/useConstCallback";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../kcContext";
import type { I18n } from "../i18n";
import { FormComposableField, useFormComposable, FormComposable, Action, Link } from "@smartb/g2";

export default function Login(props: PageProps<Extract<KcContext, { pageId: "login.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;


    const { social, realm, url, usernameEditDisabled, login, registrationDisabled } = kcContext;

    const { msg, msgStr } = i18n;

    const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);

    const initialValues = useMemo(() => ({
        ...login,
        email: login.username
    }), [login, realm])

    const formState = useFormComposable({
        formikConfig: {
            initialValues
        }
    })

    const fields = useMemo((): FormComposableField[] => {
        const loginName = !realm.loginWithEmailAllowed
            ? "username"
            : realm.registrationEmailAsUsername
                ? "email"
                : "usernameOrEmail";
        return [{
            name: loginName === "usernameOrEmail" ? "username" : loginName,
            type: "textField",
            label: msgStr(loginName),
            params: {
                textFieldType: loginName.includes('mail') ? "email" : undefined,
                disabled: usernameEditDisabled
            }
        }, {
            name: "password",
            type: "textField",
            label: msgStr("password"),
            params: {
                textFieldType: "password"
            }
        }, ...(realm.rememberMe && !usernameEditDisabled ? [{
            name: "rememberMe",
            type: "checkBox",
            label: msgStr("rememberMe"),
        } as FormComposableField] : [])]
    }, [realm, msgStr, usernameEditDisabled])

    const actions = useMemo((): Action[] => {
        return [{
            key: "logIn",
            label: msgStr("doLogIn"),
            type: "submit",
            disabled: isLoginButtonDisabled
        }]
    }, [isLoginButtonDisabled])

    const onSubmit = useConstCallback<FormEventHandler<HTMLFormElement>>(e => {
        e.preventDefault();

        setIsLoginButtonDisabled(true);

        const formElement = e.target as HTMLFormElement;

        //NOTE: Even if we login with email Keycloak expect username and password in
        //the POST request.
        formElement.querySelector("input[name='email']")?.setAttribute("name", "username");

        formElement.submit();
    });

    return (
        <Template
            {...{ kcContext, i18n, doUseDefaultCss, classes }}
            displayInfo={social.displayInfo}
            displayWide={realm.password && social.providers !== undefined}
            headerNode={msg("doLogIn")}
            infoNode={
                realm.password &&
                realm.registrationAllowed &&
                !registrationDisabled && (
                    <div id="kc-registration">
                        <span>
                            {msg("noAccount")}
                            <a tabIndex={6} href={url.registrationUrl}>
                                {msg("doRegister")}
                            </a>
                        </span>
                    </div>
                )
            }
        >
            <FormComposable
                fields={fields}
                formState={formState}
                onSubmit={onSubmit}
                action={url.loginAction}
                method="post"
                actions={actions}
            />
            {realm.resetPasswordAllowed &&
                <Link sx={{ alignSelf: "center" }} variant="caption" href={url.loginResetCredentialsUrl}>{msg("doForgotPassword")}</Link>
            }
            {/* <div id="kc-form" className={clsx(realm.password && social.providers !== undefined && getClassName("kcContentWrapperClass"))}>
                <div
                    id="kc-form-wrapper"
                    className={clsx(
                        realm.password &&
                        social.providers && [getClassName("kcFormSocialAccountContentClass"), getClassName("kcFormSocialAccountClass")]
                    )}
                >
                    {realm.password && (
                        <form id="kc-form-login" onSubmit={onSubmit} action={url.loginAction} method="post">
                            <div className={getClassName("kcFormGroupClass")}>
                                {(() => {
                                    const label = !realm.loginWithEmailAllowed
                                        ? "username"
                                        : realm.registrationEmailAsUsername
                                            ? "email"
                                            : "usernameOrEmail";

                                    const autoCompleteHelper: typeof label = label === "usernameOrEmail" ? "username" : label;

                                    return (
                                        <>
                                            <label htmlFor={autoCompleteHelper} className={getClassName("kcLabelClass")}>
                                                {msg(label)}
                                            </label>
                                            <input
                                                tabIndex={1}
                                                id={autoCompleteHelper}
                                                className={getClassName("kcInputClass")}
                                                //NOTE: This is used by Google Chrome auto fill so we use it to tell
                                                //the browser how to pre fill the form but before submit we put it back
                                                //to username because it is what keycloak expects.
                                                name={autoCompleteHelper}
                                                defaultValue={login.username ?? ""}
                                                type="text"
                                                {...(usernameEditDisabled
                                                    ? { "disabled": true }
                                                    : {
                                                        "autoFocus": true,
                                                        "autoComplete": "off"
                                                    })}
                                            />
                                        </>
                                    );
                                })()}
                            </div>
                            <div className={getClassName("kcFormGroupClass")}>
                                <label htmlFor="password" className={getClassName("kcLabelClass")}>
                                    {msg("password")}
                                </label>
                                <input
                                    tabIndex={2}
                                    id="password"
                                    className={getClassName("kcInputClass")}
                                    name="password"
                                    type="password"
                                    autoComplete="off"
                                />
                            </div>
                            <div className={clsx(getClassName("kcFormGroupClass"), getClassName("kcFormSettingClass"))}>
                                <div id="kc-form-options">
                                    {realm.rememberMe && !usernameEditDisabled && (
                                        <div className="checkbox">
                                            <label>
                                                <input
                                                    tabIndex={3}
                                                    id="rememberMe"
                                                    name="rememberMe"
                                                    type="checkbox"
                                                    {...(login.rememberMe
                                                        ? {
                                                            "checked": true
                                                        }
                                                        : {})}
                                                />
                                                {msg("rememberMe")}
                                            </label>
                                        </div>
                                    )}
                                </div>
                                <div className={getClassName("kcFormOptionsWrapperClass")}>
                                    {realm.resetPasswordAllowed && (
                                        <span>
                                            <a tabIndex={5} href={url.loginResetCredentialsUrl}>
                                                {msg("doForgotPassword")}
                                            </a>
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div id="kc-form-buttons" className={getClassName("kcFormGroupClass")}>
                                <input
                                    type="hidden"
                                    id="id-hidden-input"
                                    name="credentialId"
                                    {...(auth?.selectedCredential !== undefined
                                        ? {
                                            "value": auth.selectedCredential
                                        }
                                        : {})}
                                />
                                <input
                                    tabIndex={4}
                                    className={clsx(
                                        getClassName("kcButtonClass"),
                                        getClassName("kcButtonPrimaryClass"),
                                        getClassName("kcButtonBlockClass"),
                                        getClassName("kcButtonLargeClass")
                                    )}
                                    name="login"
                                    id="kc-login"
                                    type="submit"
                                    value={msgStr("doLogIn")}
                                    disabled={isLoginButtonDisabled}
                                />
                            </div>
                        </form>
                    )}
                </div>
                {realm.password && social.providers !== undefined && (
                    <div
                        id="kc-social-providers"
                        className={clsx(getClassName("kcFormSocialAccountContentClass"), getClassName("kcFormSocialAccountClass"))}
                    >
                        <ul
                            className={clsx(
                                getClassName("kcFormSocialAccountListClass"),
                                social.providers.length > 4 && getClassName("kcFormSocialAccountDoubleListClass")
                            )}
                        >
                            {social.providers.map(p => (
                                <li key={p.providerId} className={getClassName("kcFormSocialAccountListLinkClass")}>
                                    <a href={p.loginUrl} id={`zocial-${p.alias}`} className={clsx("zocial", p.providerId)}>
                                        <span>{p.displayName}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div> */}
        </Template>
    );
}
