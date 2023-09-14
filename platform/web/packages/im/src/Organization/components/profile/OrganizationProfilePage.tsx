import { PageHeaderObject, useExtendedAuth, useRoutesDefinition } from "components"
import { Typography } from '@mui/material'
import {Action, Page, Section, LinkButton, Button, i2Config} from '@smartb/g2'
import {Organization, useOrganizationDisable2, useOrganizationFormState} from 'connect-im'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import {OrganizationForm} from "./OrganizationForm";
import { useQueryClient } from "@tanstack/react-query"
import { useDeleteOrganizationPopUp } from "../hooks/useDeleteOrganizationPopUp"

export interface OrganizationProfilePageProps {
    readOnly: boolean
    myOrganization?: boolean
}

export const OrganizationProfilePage = (props: OrganizationProfilePageProps) => {
    const { readOnly, myOrganization = false } = props
    const { t } = useTranslation();
    const { organizationId } = useParams();
    const navigate = useNavigate()
    const { service, keycloak, policies } = useExtendedAuth()
    const { organizationsOrganizationIdView, organizationsOrganizationIdEdit, organizations } = useRoutesDefinition()

    const orgId = myOrganization ? service.getUser()?.memberOf : organizationId
    const isUpdate = !!organizationId || myOrganization

    const orgDisable = useOrganizationDisable2({
        apiUrl : i2Config().orgUrl,
        jwt : keycloak.token
    })
    const queryClient = useQueryClient()

    const onDeleteClick = useCallback(
        async (organization : Organization) => {
            const res = await orgDisable.mutateAsync({
                id: organization.id,
                anonymize: true
            })
            queryClient.invalidateQueries({ queryKey: ["organizationRefList"] })
            queryClient.invalidateQueries({ queryKey: ["organizations"] })
            queryClient.invalidateQueries({ queryKey: ["organization"] })
            if (res) navigate(organizations())
        }, [organizations]
    )

    const {open, popup} = useDeleteOrganizationPopUp({onDeleteClick : onDeleteClick})

    const onSave = useCallback(
        (data?: {
            id: string;
        }) => {
            data && navigate(organizationsOrganizationIdView(data.id))
        },
        [navigate, organizationsOrganizationIdView],
    )
    const readOnlyAddress = useCallback(
        (organization: Organization) =>
            organization.address?.street !== ""
                ? { readOnlyAddress: `${organization.address?.street}, ${organization.address?.postalCode} ${organization.address?.city}` }
                : { readOnlyAddress: undefined },
        []
    );


    const { formState, isLoading, organization } = useOrganizationFormState({
        createOrganizationOptions: {
            onSuccess: onSave,
        },
        updateOrganizationOptions: {
            onSuccess: onSave,
        },
        organizationId,
        update: isUpdate,
        myOrganization: myOrganization,
        multipleRoles: true,
        extendInitialValues : readOnlyAddress,
    })

    const headerRightPart = useMemo(() => {
        if (readOnly && organization) {
            return [
                policies.organization.canDelete() ? <Button onClick={() => {
                    open(organization)
                }} color="error" key="deleteButton">{t("closeOrganization")}</Button> : undefined,
                policies.organization.canUpdate(orgId!) ? <LinkButton to={organizationsOrganizationIdEdit(orgId!)} key="pageEditButton">{t("update")}</LinkButton> : undefined,
            ]
        }
        return []
    }, [readOnly, orgId, organizationsOrganizationIdEdit, organization, policies.organization])

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
                title: myOrganization ? t("manageAccount") : organization?.name ?? t("organizations"),
                titleProps: { sx: { flexShrink: 0 }, color: "secondary" },
                rightPart: headerRightPart
            })}
            bottomActionsProps={{
                actions: actions
            }}
        >
                <Section flexContent>
                    <Typography color="secondary" variant="h5">{t('organizationSummary')}</Typography>
                    <OrganizationForm myOrganization={myOrganization} isUpdate={isUpdate} isLoading={isLoading} formState={formState} readOnly={readOnly}/>
                </Section>
                {popup}
        </Page>
    )
}
