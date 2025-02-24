import { Page, Section, LinkButton, Button } from '@komune-io/g2';
import { UserFactory, useUserDisable, User } from 'connect-im';
import { LanguageSelector, PageHeaderObject, useExtendedAuth, useRoutesDefinition } from "components";
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Box } from "@mui/material"
import { useDeleteUserPopUp, useActivateMfaPopUp, useDisableMfaPopUp} from '../../hooks';
import { useQueryClient } from '@tanstack/react-query';
import { useUserFunctionalities } from './useUserFunctionalities';

export interface UserProfilePageProps {
    myProfile?: boolean
}

export const UserProfilePage = (props: UserProfilePageProps) => {
    const { myProfile = false } = props
    const { t } = useTranslation();
    const navigate = useNavigate()
    const { service, policies } = useExtendedAuth()
    const { userId =   service.getUserId() } = useParams();

    const queryClient = useQueryClient()
    const { usersUserIdEdit, users } = useRoutesDefinition()

    const userDisable = useUserDisable({
    })

    const onDeleteClick = useCallback(
        async (user: User) => {
            const result = await userDisable.mutateAsync({
                id: user.id,
                anonymize: true
            })

            queryClient.invalidateQueries({ queryKey: ["userPage"] })
            queryClient.invalidateQueries({ queryKey: ["userGet"] })
            if (result) {
                navigate(users())
            }
        }, [queryClient.invalidateQueries, users]
    )

    const deleteUserPopUp = useDeleteUserPopUp({
        onDeleteClick
    })

    const activateMfaPopup =  useActivateMfaPopUp()
    const disableMfaPopUp =  useDisableMfaPopUp()

    const {formState, user, isLoading, getOrganizationUrl, fieldsOverride} = useUserFunctionalities({
        myProfile,
        userId,
        readonly: true
    })
    const headerRightPart = useMemo(() => {
        if (!user) {
            return []
        }
        const actions = [
            policies.user.canDelete(user) ? <Button onClick={() => deleteUserPopUp.open(user)} color="error" key="deleteButton">{t("delete")}</Button> : undefined,
            policies.user.canUpdate(user) ? <LinkButton to={usersUserIdEdit(user.id)} key="pageEditButton">{t("update")}</LinkButton> : undefined,
        ]
        // @ts-ignore
        const mfa = user.mfa
        const isMfaEnable = !mfa || mfa.length === 0
        if(isMfaEnable) {
            policies.user.canConfigureMfa(user)
                && actions.push(
              <Button onClick={() => activateMfaPopup.open()} color="primary" key="activeMfaButton">{t("mfa.activate")}</Button>
            )
        } else {
            policies.user.canDisableMfa(user)
                && actions.push(
                  <Button onClick={() => disableMfaPopUp.open(user)} color="error" key="disableMfaButton">{t("mfa.disable")}</Button>
            )
        }

        return actions
    }, [user, t, myProfile, usersUserIdEdit, open, userId, policies.user])

    return (
        <Page
            headerProps={PageHeaderObject({
                title: myProfile ? t("profil") : t("users"),
                titleProps: { sx: { flexShrink: 0 } },
                rightPart: headerRightPart
            })}
        >
            <Section sx={{
                width: "100%",
                gap: (theme) => theme.spacing(2),
                position: "relative"
            }}>
                {myProfile && <Box
                    sx={{
                        position: "absolute",
                        top: "5px",
                        right: "15px"
                    }}
                >
                    <LanguageSelector />
                </Box>}
                <UserFactory
                    readOnly={true}
                    formState={formState}
                    isLoading={isLoading}
                    user={user}
                    userId={userId}
                    multipleRoles={false}
                    getOrganizationUrl={getOrganizationUrl}
                    fieldsOverride={fieldsOverride}
                />
            </Section>
            {deleteUserPopUp.popup}
            {activateMfaPopup.popup}
            {disableMfaPopUp.popup}
        </Page>
    )
}
