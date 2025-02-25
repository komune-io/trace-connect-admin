import { useTranslation } from "react-i18next";
import { Typography } from "@mui/material";
import {User, useUserDisableMfa} from "connect-im";
import {useCallback, useState} from "react";
import {useQueryClient} from "@tanstack/react-query";
import {useDeletedConfirmationPopUp} from "components";

interface UseDisableMfaUserPopUpProps {
}
export const useDisableMfaPopUp = (_?: UseDisableMfaUserPopUpProps) => {
    const { t } = useTranslation();
    const [user, setUser] = useState<User | undefined>(undefined)
    const useDisableMfa = useUserDisableMfa({})
    const queryClient = useQueryClient()
    const userDisableMfa = useCallback(async () => {
        user && await useDisableMfa.mutateAsync({id: user?.id})
        queryClient.invalidateQueries({ queryKey: ["userPage"] })
        await queryClient.invalidateQueries({ queryKey: ["userGet"] })
    }, [user])

    const popup = useDeletedConfirmationPopUp({
        title: t("mfa.disable"),
        component: <Typography sx={{ margin: (theme) => `${theme.spacing(4)} 0` }}>{t("mfa.disableDescription")}</Typography>,
        onDelete: userDisableMfa,
    });

    const open = useCallback(
        (user: User) => {
            setUser(user)
            popup.setOpen(true)
        },
        [popup.setOpen],
    )

    return {
        ...popup,
        open
    }
}