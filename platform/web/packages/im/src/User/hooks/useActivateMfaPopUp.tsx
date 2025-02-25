import { useTranslation } from "react-i18next";
import { Typography } from "@mui/material";
import { useCallback } from "react";
import {useConfirmationPopUp} from "components/src/hooks/usePopUp";
import {useExtendedAuth} from "components";

interface UseActivateMfaUserPopUpProps {}
export const useActivateMfaPopUp = (_?: UseActivateMfaUserPopUpProps) => {
    const { t } = useTranslation();
    const { keycloak } = useExtendedAuth()

    const popup = useConfirmationPopUp({
        title: t("mfa.activate"),
        component: <Typography sx={{ margin: (theme) => `${theme.spacing(4)} 0` }}>{t("mfa.activateDescription")}</Typography>,
        onConfirm: () => keycloak.login(window.location.href, {
            "acr_values": 'force-mfa'
        })
    });

    const open = useCallback(
        () => {
            popup.setIsOpen(true)
        },
        [popup.setIsOpen],
    )

    return {
        ...popup,
        open
    }
}