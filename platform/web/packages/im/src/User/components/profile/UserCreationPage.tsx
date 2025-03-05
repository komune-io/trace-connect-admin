import { Page, Section } from '@komune-io/g2';
import { UserFactory } from 'connect-im';
import { PageHeaderObject, useExtendedAuth } from "components";
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { useUserFunctionalities } from './useUserFunctionalities';


export const UserCreationPage = () => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams()
    const { service } = useExtendedAuth()

    const organizationId = useMemo(() => {
        return searchParams.get('organizationId') ?? service.getUser()?.memberOf
    }, [searchParams, service.getUser])

    const { checkEmailValidity, fieldsOverride, formState, formActions, isLoading, user } = useUserFunctionalities( {
        organizationId,
        isCreate: true
    })
    
    return (
        <Page
            headerProps={PageHeaderObject({
                title:  t("users"),
                titleProps: { sx: { flexShrink: 0 } }
            })}
            bottomActionsProps={{
                actions: formActions
            }}
        >
            <Section >
                <UserFactory
                    formState={formState}
                    update={false}
                    isLoading={isLoading}
                    user={user}
                    organizationId={organizationId}
                    multipleRoles={true}
                    fieldsOverride={fieldsOverride}
                    checkEmailValidity={checkEmailValidity}
                />
            </Section>
        </Page>
    )
}
