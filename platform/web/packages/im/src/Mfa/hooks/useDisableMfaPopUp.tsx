import { useTranslation } from "react-i18next";
import { Typography } from "@mui/material";
import {User, useUserDisableMfa} from "connect-im";
import {useCallback, useEffect, useMemo} from "react";
import {useQueryClient} from "@tanstack/react-query";
import {useDeletedConfirmationPopUp, useExtendedAuth, useRoutesDefinition} from "components";
import {isPasswordOtpAcrActivated} from "../../Mfa";

interface UseDisableMfaUserPopUpProps {
    open?: boolean,
    user?: User
    onClosed: () => void
}

export const useDisableMfaPopUp = (props: UseDisableMfaUserPopUpProps) => {
    const { t } = useTranslation();
    const { open = false, user, onClosed } = props
    const useDisableMfa = useUserDisableMfa({})
    const queryClient = useQueryClient()
    const { keycloak } = useExtendedAuth()
    const { myProfilMfaDisable } = useRoutesDefinition();
    const userDisableMfa = useCallback(async () => {
        user?.id && await useDisableMfa.mutateAsync({id: user?.id})
        await Promise.all([
            queryClient.invalidateQueries({queryKey: ["userPage"]}),
            queryClient.invalidateQueries({queryKey: ["userGet"]})
        ])
    }, [user?.id])

    const deletionAction = useMemo<DeletionAction>(() => {
        if(isPasswordOtpAcrActivated(keycloak.tokenParsed?.acr)) {
            return {
                message: t("mfa.disableDescription"),
                onDelete: userDisableMfa
            }
        } else {
            return {
                message: t("mfa.disableConfirmation"),
                onDelete: () => keycloak.login(myProfilMfaDisable(), {
                    "acr_values": 'password-otp'
                })
            }
        }

    }, [isPasswordOtpAcrActivated, userDisableMfa, keycloak.tokenParsed?.acr])

    const popup = useDeletedConfirmationPopUp({
        title: t("mfa.disable"),
        component: <Typography sx={{ margin: (theme) => `${theme.spacing(4)} 0` }}>{deletionAction.message}</Typography>,
        onDelete: deletionAction.onDelete,
        onClosed: onClosed
    });

    useEffect(() => {   popup.setOpen(open) }, [open])

    return {
        ...popup,
        open
    }
}

interface DeletionAction {
    message: string
    onDelete: () => Promise<any>
}