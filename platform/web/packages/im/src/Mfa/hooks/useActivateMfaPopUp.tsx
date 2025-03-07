import { useTranslation } from "react-i18next";
import { Typography } from "@mui/material";
import {useConfirmationPopUp} from "components/src/hooks/usePopUp";
import {useExtendedAuth, useRoutesDefinition} from "components";
import {User} from "connect-im";
import {ImMfaPasswordOtpFlowACR, isUserMfaEnable} from "../utils";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";

interface UseActivateMfaUserPopUpProps {
    open: boolean
    user?: User
    onClosed: () => void
}
export const useActivateMfaPopUp = (props: UseActivateMfaUserPopUpProps) => {
    const { t } = useTranslation();
    const { keycloak } = useExtendedAuth()
    const { open, onClosed, user } = props
    const { myProfil } = useRoutesDefinition();
    const arcValues: ImMfaPasswordOtpFlowACR = 'password-otp'
    const navigate = useNavigate();
    const popup = useConfirmationPopUp({
        title: t("mfa.activate"),
        component: <Typography sx={{ margin: (theme) => `${theme.spacing(4)} 0` }}>{t("mfa.activateDescription")}</Typography>,
        onConfirm: () => keycloak.login(myProfil(), {
            "acr_values": arcValues
        }),
        onClosed: onClosed
    });

    useEffect(() => {
        if(!user) {
            return;
        }
        const isActivated = isUserMfaEnable(user)
        if(open && isActivated) {
            navigate(myProfil())
        } else {
            popup.setIsOpen(open)
        }

    }, [open, user])

    return {
        ...popup,
    }
}