import { Page, Section, LinkButton, Button } from '@komune-io/g2';
import { UserFactory, useUserDisable, User } from 'connect-im';
import { LanguageSelector, PageHeaderObject, useExtendedAuth, useRoutesDefinition } from "components";
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Box } from "@mui/material";
import { useDeleteUserPopUp } from '../../hooks';
import { useQueryClient } from '@tanstack/react-query';
import { useUserFunctionalities } from './useUserFunctionalities';
import {MfaAction, UserProfileMfaAction} from "../../../Mfa";


export interface UserProfilePageProps {
    myProfile?: boolean;
    mfa?: MfaAction;
}

export const UserProfilePage = ({ myProfile = false, mfa }: UserProfilePageProps) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { service, policies } = useExtendedAuth();
    const { userId: paramUserId } = useParams();
    const userId = paramUserId ?? service.getUserId(); // Ensure userId is always defined
    const queryClient = useQueryClient();
    const { usersUserIdEdit, users } = useRoutesDefinition();

    const userDisable = useUserDisable();

    const onDeleteClick = useCallback(
      async (user: User) => {
          const result = await userDisable.mutateAsync({
              id: user.id,
              anonymize: true
          });

          await queryClient.invalidateQueries({ queryKey: ["userPage"] });
          await queryClient.invalidateQueries({ queryKey: ["userGet"] });

          if (result) {
              navigate(users());
          }
      },
      [queryClient, users, userDisable]
    );

    const { open: openDeleteUserPopup, popup: deleteUserPopupElement } = useDeleteUserPopUp({
        onDeleteClick
    });

    const { formState, user, isLoading, getOrganizationUrl, fieldsOverride } = useUserFunctionalities({
        myProfile,
        userId,
        readonly: true,
        multipleRoles: true
    });

    const headerRightPart = useMemo(() => {
        if (!user) {
            return []
        }
        const actions = [
            policies.user.canDelete(user) ? <Button onClick={() => openDeleteUserPopup(user)} color="error" key="deleteButton">{t("delete")}</Button> : undefined,
            policies.user.canUpdate(user) ? <LinkButton to={usersUserIdEdit(user.id)} key="pageEditButton">{t("update")}</LinkButton> : undefined,
        ]
        if(myProfile) {
            actions.push(<UserProfileMfaAction user={user} mfa={mfa}/>)
        }

        return actions
    }, [user, t, myProfile, usersUserIdEdit, openDeleteUserPopup, mfa, policies.user]);

    return (
      <Page
        headerProps={PageHeaderObject({
            title: myProfile ? t("profil") : t("users"),
            titleProps: { sx: { flexShrink: 0 } },
            rightPart: headerRightPart
        })}
      >
          <Section
            sx={{
                width: "100%",
                gap: (theme) => theme.spacing(2),
                position: "relative"
            }}
          >
              {myProfile && (
                <Box
                  sx={{
                      position: "absolute",
                      top: "5px",
                      right: "15px"
                  }}
                >
                    <LanguageSelector />
                </Box>
              )}
              <UserFactory
                readOnly
                formState={formState}
                isLoading={isLoading}
                user={user}
                userId={userId}
                multipleRoles
                getOrganizationUrl={getOrganizationUrl}
                fieldsOverride={fieldsOverride}
              />
          </Section>
          {deleteUserPopupElement}
      </Page>
    );
};
