import {getUserOrganizationRolesOptions, useExtendedAuth, useRoutesDefinition} from 'components';
import { UserFactoryFieldsOverride, useGetOrganizationRefs, useUserFormState, userExistsByEmail } from 'connect-im';
import { useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useUserPolicies } from '../../../Policies/usePolicies';
import { Action, imConfig, validators } from '@komune-io/g2';

interface UseUserFunctionalitiesParams {
    organizationId?: string
    userId?: string
    isUpdate?: boolean
    isCreate?: boolean
    myProfile?: boolean
    readonly?: boolean
}

export const useUserFunctionalities = (params?: UseUserFunctionalitiesParams) => {
    const { isUpdate = false, isCreate = false, myProfile = false, organizationId, userId, readonly = false } = params ?? {}
    const { t, i18n } = useTranslation();
    const navigate = useNavigate()
    const { keycloak, roles } = useExtendedAuth()
    const getOrganizationRefs = useGetOrganizationRefs({ jwt: keycloak.token })


    const { usersUserIdView, organizationsOrganizationIdView } = useRoutesDefinition()
    const onSave = useCallback(
        (data?: {
            id: string;
        }) => {
            data && navigate(usersUserIdView(data.id))
        },
        [navigate, usersUserIdView]
    )

    const { formState, isLoading, user } = useUserFormState({
        createUserOptions: {
            onSuccess: onSave,
        },
        updateUserOptions: {
            onSuccess: onSave,
        },
        userId,
        update: isUpdate,
        myProfile: myProfile,
        multipleRoles: false,
        organizationId
    })

    const userPolicies = useUserPolicies({ user: user })

    const rolesOptions = useMemo(() => {
        const org = getOrganizationRefs.query.data?.items.find((org) => org.id === formState.values.memberOf)
        const orgRole = roles?.find((role: any) => role.identifier === org?.roles[0])
        return getUserOrganizationRolesOptions(i18n.language, orgRole, roles)
    }, [i18n.language, t, getOrganizationRefs.query.data?.items, formState.values.memberOf, roles])

    const getOrganizationUrl = useCallback(
        (organizationId: string) => organizationsOrganizationIdView(organizationId),
        [organizationsOrganizationIdView],
    )

    useEffect(() => {
        if (!isUpdate && !readonly) formState.setFieldValue('roles', undefined)
    }, [formState.values.memberOf, isUpdate, readonly])

    const formActions = useMemo((): Action[] | undefined => {
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
    }, [ formState.submitForm])

    const organizationOptions = useMemo(() =>
        getOrganizationRefs.query.data?.items.map(
            (ref) => ({ key: ref.id, label: ref.name })
        ), [getOrganizationRefs])

    const checkEmailValidity = useCallback(
        async (email: string) => {
            return userExistsByEmail(email, imConfig().url, keycloak.token)
        },
        [keycloak.token]
    )

    const fieldsOverride = useMemo((): UserFactoryFieldsOverride => {
        return {
            roles: {
                params: {
                    options: rolesOptions,
                    disabled: !isCreate && !isUpdate && !formState.values.memberOf
                },
                readOnly: !isCreate && !isUpdate || !userPolicies.canUpdateRole,
                validator: validators.requiredField(t)
            },
            memberOf: {
                readOnly: !isCreate && !isUpdate || !userPolicies.canUpdateOrganization,
                params: {
                    options: organizationOptions
                }
            }
        }
    }, [t, rolesOptions, isUpdate, organizationOptions, userPolicies, formState.values.memberOf])

    return {
        formState, 
        isLoading, 
        user,
        checkEmailValidity,
        fieldsOverride,
        formActions,
        getOrganizationUrl
    }
}
