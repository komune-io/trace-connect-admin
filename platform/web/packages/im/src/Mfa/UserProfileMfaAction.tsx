import { Button } from '@komune-io/g2';
import { User } from 'connect-im';
import { useExtendedAuth, useRoutesDefinition } from "components";
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import {isUserMfaEnable, useActivateMfaPopUp, useDisableMfaPopUp} from "./index";

export type MfaAction = "activate" | "disable";

export interface UserProfileMfaActionProps {
    user: User;
    mfa?: MfaAction;
}

export const UserProfileMfaAction = ({ user, mfa }: UserProfileMfaActionProps) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { myProfil, myProfilMfaActivate, myProfilMfaDisable } = useRoutesDefinition();
    const { policies } = useExtendedAuth();
    const queryClient = useQueryClient();

    const onMfaPopupClosed = useCallback(async () => {
        await queryClient.invalidateQueries({ queryKey: ["userGet"] });
        navigate(myProfil());
    }, [queryClient, navigate]);

    const activateMfaPopup = useActivateMfaPopUp({
        open: mfa === "activate",
        user,
        onClosed: onMfaPopupClosed
    });

    const disableMfaPopUp = useDisableMfaPopUp({
        open: mfa === "disable",
        user,
        onClosed: onMfaPopupClosed
    });

    const actions: JSX.Element[] = [];

    if (isUserMfaEnable(user)) {
        if (policies.user.canDisableMfa(user)) {
            actions.push(
              <Button
                key="disableMfaButton"
                onClick={() => navigate(myProfilMfaDisable())}
                color="error"
              >
                  {t("mfa.disable")}
              </Button>
            );
        }
    } else {
        if (policies.user.canConfigureMfa(user)) {
            actions.push(
              <Button
                key="activateMfaButton"
                onClick={() => navigate(myProfilMfaActivate())}
                color="primary"
              >
                  {t("mfa.activate")}
              </Button>
            );
        }
    }

    return (
      <>
          {activateMfaPopup.popup}
          {disableMfaPopUp.popup}
          {actions.length > 0 && actions}
      </>
    );
};
