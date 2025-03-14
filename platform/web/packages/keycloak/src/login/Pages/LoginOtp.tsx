
import {type FormEventHandler, useCallback, useMemo, useState} from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import {Action, FormComposable, FormComposableField, useFormComposable, validators} from "@komune-io/g2";
import {useTranslation} from "react-i18next";
import {maybeAddItem} from "./LoginConfigTotp.tsx";

export default function LoginOtp(props: PageProps<Extract<KcContext, { pageId: "login-otp.ftl" }>, I18n>) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

  const {t} = useTranslation()
  const { otpLogin, url, messagesPerField, auth } = kcContext;

  const { msg, msgStr } = i18n;
  const [isAuthenticating, setAuthenticating] = useState(false)

  const formState = useFormComposable({
    formikConfig: {
      initialValues: {
        selectedCredentialId: otpLogin.selectedCredentialId
      }
    }
  })

  const actions = useMemo((): Action[] => {
    return [{
      key: "login",
      label: msgStr("doLogIn"),
      type: "submit",
      sx: {
        width: "90%",
        alignSelf: "center",
        mt: 1
      },
      isLoading: isAuthenticating,
      size: "large"
    }]}, [isAuthenticating, msgStr])


  const fields = useMemo((): FormComposableField[] => {
    return [...maybeAddItem<FormComposableField>(otpLogin.userOtpCredentials.length > 1, {
      name: "selectedCredentialId",
      type: "radioChoices",
      params: {
        options: otpLogin.userOtpCredentials.map(otpCredential => ({
          key: otpCredential.id,
          label: otpCredential.userLabel,

        }))
      },
    }),{
      name: "otp",
      type: "textField",
      label: msgStr("loginOtpOneTime"),
      validator: validators.requiredField(t)
    }]
  }, [msgStr])

  const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>(async (e) => {
    e.preventDefault();
    setAuthenticating(true);

    const errors = await formState.validateForm()
    if (errors && Object.keys(errors).length > 0) {
      setAuthenticating(false);
      return
    }

    const formElement = e.target as HTMLFormElement;

    formElement.submit();
  }, [formState.validateForm]);


  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      displayMessage={!messagesPerField.existsError("totp")}
      headerNode={auth?.attemptedUsername ?? msg("doLogIn")}
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
    </Template>
  );
}
