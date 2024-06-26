import { useTranslation } from "react-i18next";
import { PageHeaderObject, useExtendedAuth } from "components";
import { useCallback, useMemo } from "react";
import { Action, Page, Section, useFormComposable, useGetOrganizationRefs } from "@komune-io/g2";
import { Typography } from "@mui/material";
import { useCreatedConfirmationPopUp } from "../../hooks";
import { ApiKeyAddCommand, useApiKeyAddFunction } from "../../api/";
import { useNavigate } from "react-router-dom";
import { APIKeyForm } from "../../components";
import { usePolicies } from "../../../Policies/usePolicies";
import { useQueryClient } from "@tanstack/react-query";

export interface APIKeyProfilePageProps {
    readOnly: boolean
}
export const ApiKeyAddPage = (props: APIKeyProfilePageProps) => {
    const { readOnly } = props
    const { t } = useTranslation();
    const navigate = useNavigate()
    const { service, keycloak } = useExtendedAuth()
    const policies = usePolicies()
    const organizationId = service.getUser()!!.memberOf ?? ""
   const queryClient = useQueryClient()
    const apiKeyAddFunction = useApiKeyAddFunction()
    const createdConfirmation = useCreatedConfirmationPopUp();
    const getOrganizationRefs = useGetOrganizationRefs({ jwt: keycloak.token })

    const createAPIKey = useCallback(async (command: ApiKeyAddCommand) => {
        const result = command.name && await apiKeyAddFunction.mutateAsync({
            organizationId: command.organizationId ?? organizationId,
            name: command.name,
            roles: command.roles
        });
        if (result) {
            queryClient.invalidateQueries({queryKey: ["apiKeyPage"]})
            createdConfirmation.open(result)
        }
    }, [organizationId]);

    const formState = useFormComposable({
        emptyValueInReadOnly: "-",
        readOnly: false,
        onSubmit: createAPIKey
    })

    const actions = useMemo((): Action[] | undefined => {
        if (!readOnly) {
            return [{
                key: "cancel",
                label: t("cancel"),
                onClick: () => navigate(-1),
                variant: "text"
            }, {
                key: "save",
                label: t("save"),
                onClick: formState.submitForm
            }]
        }
    }, [readOnly, formState.submitForm])

    return (
        <Page
            headerProps={PageHeaderObject({
                title: t("apiKeys"),
                titleProps: { sx: { flexShrink: 0 }, color: "secondary" },
            })}
            bottomActionsProps={{
                actions: actions
            }}
        >
            <Section flexContent>
                <Typography color="secondary" variant="h5">{t('apiKeySummary')}</Typography>
                <APIKeyForm orgSelect={policies.apiKeys.canCreateForAllOrg} orgRefs={getOrganizationRefs.query.data?.items} readOnly={readOnly} formState={formState} />
            </Section>
            {createdConfirmation.popup}
        </Page>
    )
}
