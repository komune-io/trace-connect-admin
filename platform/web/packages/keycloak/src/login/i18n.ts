import { i18nBuilder } from "keycloakify/login";
import type { ThemeName } from "../kc.gen";

/** @see: https://docs.keycloakify.dev/i18n */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { useI18n, ofTypeI18n } = i18nBuilder
    .withThemeName<ThemeName>()
    .withCustomTranslations({
        en: {
            alphanumericalCharsOnly: "Only alphanumerical characters",
            gender: "Gender",
            // Here we overwrite the default english value for the message "doForgotPassword" 
            // that is "Forgot Password?" see: https://github.com/InseeFrLab/keycloakify/blob/f0ae5ea908e0aa42391af323b6d5e2fd371af851/src/lib/i18n/generated_messages/18.0.1/login/en.ts#L17
            doForgotPassword: "Forgot password ?",
            backToLogin: "Back to login",
            email: "Email",
            resetPasswordInstructions: "Please enter the email address associated with your account. We will send you a link to reset your password.",
            resetPasswordNoEmailInstructions: "If you don't receive an email within a few minutes, please check your spam folder.",
            resetPasswordNote: "Note: Make sure to provide the email address that you used to create your account.",
            resetPasswordSend: "Send reset instructions"
        },
        fr: {
            alphanumericalCharsOnly: "Caractère alphanumérique uniquement",
            gender: "Genre",
            doForgotPassword: "Mot de passe oublié ?",
            backToLogin: "Retour à la connexion",
            email: "Email",
            resetPasswordInstructions: "Veuillez entrer l'adresse email associé à votre compte. Nous allons vous envoyer un lien pour renouveller votre mot de passe.",
            resetPasswordNoEmailInstructions: "Si vous ne recevez pas un email dans les prochaines minutes, n'oubliez pas de regarder vos spams.",
            resetPasswordNote: "Note: Assurez vous de renseigner l'adresse mail que vous avez utilisé pour créer votre compte.",
            resetPasswordSend: "Envoyer les instructions de renouvellement"
        }
    })
    .build();

type I18n = typeof ofTypeI18n;

export { useI18n, type I18n };
