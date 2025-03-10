// ejected using 'npx eject-keycloak-page'
import { useMemo, useCallback, useState, type FormEventHandler } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { I18n } from "../i18n";
import { FormComposableField, useFormComposable, FormComposable, Action, Link, validators } from "@komune-io/g2";
import { useTranslation } from "react-i18next";
import { Stack } from "@mui/material"
import { KcContext } from "../KcContext";

export const Login = (props: PageProps<Extract<KcContext, { pageId: "login.ftl" }>, I18n>) => {
    const { kcContext, i18n, doUseDefaultCss, Template, classes, } = props;

    const { realm, url, usernameHidden, login, auth } = kcContext;

    const { msgStr } = i18n;
    const [isAuthenticating, setAuthenticating] = useState(false)
    const { t } = useTranslation()

    const initialValues = useMemo(() => ({
        ...login,
        email: login.username,
        credentialId: auth?.selectedCredential
    }), [login, realm, auth?.selectedCredential])

    const formState = useFormComposable({
        formikConfig: {
            initialValues
        }
    })

    const fields = useMemo((): FormComposableField[] => {
        // const loginName = !realm.loginWithEmailAllowed
        //     ? "username"
        //     : realm.registrationEmailAsUsername
        //         ? "email"
        //         : "usernameOrEmail";
        return [{
            name: "email",
            type: "textField",
            label: msgStr("email"),
            params: {
                textFieldType: "text",
                disabled: usernameHidden,
                inputProps: {
                    tabIndex: 1
                }
            },
            validator: validators.requiredField(t)
        }, {
            name: "credentialId",
            type: "hidden"
        }, {
            name: "password",
            type: "textField",
            //@ts-ignore
            label: <Stack
                direction="row"
                gap={1}
                justifyContent="space-between"
            >
                {msgStr("password")}
                {realm.resetPasswordAllowed &&
                    <Link tabIndex={4} sx={{ alignSelf: "center" }} variant="caption" href={url.loginResetCredentialsUrl}>{msgStr("doForgotPassword")}</Link>
                }
            </Stack>,
            params: {
                textFieldType: "password",
                inputProps: {
                    tabIndex: 2
                }
            },
            validator: validators.password(t)
        }, ...(realm.rememberMe && !usernameHidden ? [{
            name: "rememberMe",
            type: "checkBox",
            label: msgStr("rememberMe"),
            params: {
                inputProps: {
                    tabIndex: 3
                }
            }
        } as FormComposableField] : [])]
    }, [realm, msgStr, usernameHidden, t])

    const actions = useMemo((): Action[] => {
        return [{
            key: "logIn",
            label: msgStr("doLogIn"),
            type: "submit",
            isLoading: isAuthenticating
        }]
    }, [isAuthenticating, msgStr])

    const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>(async (e) => {
        e.preventDefault();
        setAuthenticating(true);

        const errors = await formState.validateForm()
        if (errors && Object.keys(errors).length > 0) {
            setAuthenticating(false);
            return
        }

        const formElement = e.target as HTMLFormElement;

        //NOTE: Even if we login with email Keycloak expect username and password in
        //the POST request.
        formElement.querySelector("input[name='email']")?.setAttribute("name", "username");

        formElement.submit();
    }, [formState.validateForm]);

    return (
        <Template
            {...{ kcContext, i18n, doUseDefaultCss, classes }}
            headerNode={msgStr("doLogIn")}
        >
            <FormComposable
                fields={fields}
                formState={formState}
                actions={actions}
                action={url.loginAction}
                method="post"
                onSubmit={onSubmit}
            />
        </Template>
    );
}
