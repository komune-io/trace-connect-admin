import { useTranslation } from "react-i18next";
import { Typography } from "@mui/material";
import {useConfirmationPopUp} from "components/src/hooks/usePopUp";
import {useExtendedAuth} from "components";
import {User} from "connect-im";
import {useEffect} from "react";
import {isUserMfaEnable} from "../../Mfa";

interface UseActivateMfaUserPopUpProps {
    open: boolean
    user?: User
    onClosed: () => void
}
export const useActivateMfaPopUp = (props: UseActivateMfaUserPopUpProps) => {
    const { t } = useTranslation();
    const { keycloak } = useExtendedAuth()
    const { open, onClosed, user } = props
    const popup = useConfirmationPopUp({
        title: t("mfa.activate"),
        component: <Typography sx={{ margin: (theme) => `${theme.spacing(4)} 0` }}>{t("mfa.activateDescription")}</Typography>,
        onConfirm: () => keycloak.login(window.location.href, {
            "acr_values": 'password-otp'
        }),
        onClosed: onClosed
    });

    useEffect(() => {
        const isActivated = !user || isUserMfaEnable(user)
        if(isActivated) {
            onClosed()
        } else {
            open && !!user && popup.setIsOpen(true)
        }

    }, [open, user])

    return {
        ...popup,
    }
}