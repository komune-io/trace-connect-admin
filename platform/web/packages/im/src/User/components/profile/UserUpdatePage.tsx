import { Page, Section, } from '@komune-io/g2';
import { UserFactory } from 'connect-im';
import { PageHeaderObject } from "components";
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useUserFunctionalities } from './useUserFunctionalities';

export interface UserUpdatePageProps {
    myProfile?: boolean
}

export const UserUpdatePage = (props: UserUpdatePageProps) => {
    const { myProfile = false } = props
    const { t } = useTranslation();
    const { userId } = useParams();

    const { checkEmailValidity, fieldsOverride, formState, formActions, isLoading, user } = useUserFunctionalities({
        isUpdate: true,
        myProfile,
        userId
    })

    return (
        <Page
            headerProps={PageHeaderObject({
                title: myProfile ? t("profil") : t("users"),
                titleProps: { sx: { flexShrink: 0 } }
            })}
            bottomActionsProps={{
                actions: formActions
            }}
        >
            <Section >
                <UserFactory
                    readOnly={false}
                    formState={formState}
                    update={true}
                    isLoading={isLoading}
                    user={user}
                    userId={userId}
                    resetPasswordType={myProfile ? 'email' : undefined}
                    multipleRoles={false}
                    fieldsOverride={fieldsOverride}
                    checkEmailValidity={checkEmailValidity}
                />
            </Section>
        </Page>
    )
}
