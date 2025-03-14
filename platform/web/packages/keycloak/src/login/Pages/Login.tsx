// ejected using 'npx eject-keycloak-page'
import { useMemo, useCallback, useState, type FormEventHandler } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { I18n } from "../i18n";
import { FormComposableField, useFormComposable, FormComposable, Action, Link, validators } from "@komune-io/g2";
import { useTranslation } from "react-i18next";
import { Stack } from "@mui/material"
import { KcContext } from "../KcContext";
import {getKcClsx} from "keycloakify/login/lib/kcClsx";

export const Login = (props: PageProps<Extract<KcContext, { pageId: "login.ftl" }>, I18n>) => {
    const { kcContext, i18n, doUseDefaultCss, Template, classes, } = props;

    const { realm, url, usernameHidden, login, auth } = kcContext;

    const { msgStr } = i18n;
    const [isAuthenticating, setAuthenticating] = useState(false)
    const { t } = useTranslation()

    const initialValues = useMemo(() => ({
        ...login,
        email: login.username || auth.attemptedUsername,
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
            },
            validator: validators.requiredField(t),
            customDisplay: (input) => (
              <Stack
                gap={2}
                alignItems="flex-end"
              >
                  {input}
                  {auth !== undefined && auth.showUsername && !auth.showResetCredentials &&
                    <LoginRestartFlowButton {...props}/>
                  }
              </Stack>
            )
        }, {
            name: "credentialId",
            type: "hidden"
        }, {
            name: "password",
            type: "textField",
            label: msgStr("password"),
            params: {
                textFieldType: "password",
            },
            validator: validators.password(t),
            customDisplay: (input) => (
                <Stack
                    gap={2}
                    alignItems="flex-end"
                >
                    {input}
                    {realm.resetPasswordAllowed &&
                        <Link sx={{ color: "#828282", }} variant="caption" href={url.loginResetCredentialsUrl}>{msgStr("doForgotPassword")}</Link>
                    }
                </Stack>
            )
        }
        ]
    }, [realm, msgStr, usernameHidden, t])

    const actions = useMemo((): Action[] => {
        return [{
            key: "logIn",
            label: msgStr("signIn"),
            type: "submit",
            sx: {
                width: "90%",
                alignSelf: "center",
                mt: 1
            },
            isLoading: isAuthenticating,
            size: "large"
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
            headerNode={msgStr("signInTitle")}
        >
            <FormComposable
                sx={{
                    "& .AruiActions-Wrapper": {
                        justifyContent: "center"
                    }
                }}
                fields={fields}
                formState={formState}
                actions={actions}
                action={url.loginAction}
                method="post"
                onSubmit={onSubmit}
            />
            <Link
                    variant="body2"
                    href={url.registrationUrl}
                    sx={{
                        color: "#828282",
                        textDecoration: "unset !important",
                        mt: -1,
                        alignSelf: "center"
                    }}
                >
                    {`${msgStr("dontHaveAccount")} `}
                    <span
                    style={{
                        textDecoration: "underline"
                    }}
                    >
                       {msgStr("signUp")}
                    </span>
                </Link>
        </Template>
    );
}


export const LoginRestartFlowButton = (props: PageProps<Extract<KcContext, { pageId: "login.ftl" }>, I18n>) => {
    const { kcContext, i18n, doUseDefaultCss, classes} = props;

    const { url } = kcContext;

    const { msgStr } = i18n;
    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

    return (
      <div id="kc-username" className={kcClsx("kcFormGroupClass")}>
          <Link sx={{ color: "#828282", }} variant="caption" href={url.loginRestartFlowUrl}>{msgStr("restartLoginTooltip")}</Link>
      </div>
    );
}

// fa-sync-alt fas
