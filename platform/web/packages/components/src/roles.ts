import { Option, QueryParams, imConfig, useQueryRequest } from "@komune-io/g2"
import { io } from "@komune-io/im-privilege-domain"
import { useMemo } from "react"
import { useOidcAccessToken } from '@axa-fr/react-oidc'
import { TFunction } from "i18next"


export interface Role extends io.komune.im.f2.privilege.domain.role.model.RoleDTO { }

export interface Permission extends io.komune.im.f2.privilege.domain.permission.model.PermissionDTO { }

export const RoleTargetValues = io.komune.im.f2.privilege.domain.role.model.RoleTargetValues

export interface RoleListQuery extends io.komune.im.f2.privilege.domain.role.query.RoleListQueryDTO { }

export interface RoleListResult extends io.komune.im.f2.privilege.domain.role.query.RoleListResultDTO { }

export const useRoleListQuery = (params: QueryParams<RoleListQuery, RoleListResult>) => {
    const { accessToken } = useOidcAccessToken()
    const requestProps = useMemo(() => ({
        url: imConfig().url,
        jwt: accessToken
    }), [accessToken])
    return useQueryRequest<RoleListQuery, RoleListResult>(
        "roleList", requestProps, params
    )
}

export interface PermissionListQuery extends io.komune.im.f2.privilege.domain.permission.query.PermissionListQueryDTO { }

export interface PermissionListResult extends io.komune.im.f2.privilege.domain.permission.query.PermissionListResultDTO { }

export const usePermissionListQuery = (params: QueryParams<PermissionListQuery, PermissionListResult>) => {
    const { accessToken } = useOidcAccessToken()
    const requestProps = useMemo(() => ({
        url: imConfig().url,
        jwt: accessToken
    }), [accessToken])
    return useQueryRequest<PermissionListQuery, PermissionListResult>(
        "permissionList", requestProps, params
    )
}

export const getUserRoleColor = (role?: string) => role === "super_admin" ? "#d1b00a" : role === "user" ? "#3041DC" : "#E56643"

export const getUserRolesFilterOptions = (t: TFunction) => {

    const roles: Option[] = []
    roles.push({
        key: "admin",
        label: t(`roles.admin`) as string,
        color: getUserRoleColor("admin")
    })
    roles.push({
        key: "user",
        label: t(`roles.user`) as string,
        color: getUserRoleColor("user")
    })
    return roles
}

export const getUserRolesOptions = (lang: string, roles?: Role[]) => {
    if (!roles) return []
    const options: Option[] = []
    roles.forEach(role => {
            if (role.targets.includes(RoleTargetValues.user())) {
                options.push({
                    key: role.identifier,
                    label: role.locale[lang],
                    color: getUserRoleColor(role.identifier)
                })
            }
        }
    )
    return options
}


export const getUserOrganizationRolesOptions = (lang: string, orgRoles?: Role[], roles?: Role[]) => {
    if (!roles || !orgRoles) return []

    const options: Option[] = []
    const targetedUserRoles: Role[] = orgRoles?.flatMap(orgRole => orgRole.bindings["USER"])
    if (Object.keys(targetedUserRoles).length === 0) return []
    roles.forEach((role) => {
        if (targetedUserRoles.find((target) => target.identifier === role.identifier)) {
            options.push({
                key: role.identifier,
                label: role.locale[lang],
                color: getUserRoleColor(role.identifier)
            })
        }
    })

    return options
}

export const getOrgRoleColor = () => "#27848f"

export const getOrgRolesOptions = (lang: string, roles?: Role[]) => {
    if (!roles) return []
    const options: Option[] = []
    roles.forEach(role => {
        if (role.targets.includes(RoleTargetValues.organization())) {
            options.push({
                key: role.identifier,
                label: role.locale[lang],
                color: getOrgRoleColor()
            })
        }
    }
    )
    return options
}

export const getApiKeysRolesOptions = (lang: string, orgRole?: Role, roles?: Role[]) => {
    if (!roles || !orgRole) return []
    const targetedRoles: Role[] = orgRole.bindings["API_KEY"]
    if (Object.keys(targetedRoles).length === 0) return []
    const options: Option[] = []
    roles.forEach(role => {
        if (targetedRoles.find((target) => target.identifier === role.identifier)) {
            options.push({
                key: role.identifier,
                label: role.locale[lang],
                color: getUserRoleColor(role.identifier)
            })
        }
    }
    )
    return options
}

export const permissions = [
    "im_user_read",
    "im_user_write",
    "im_organization_read",
    "im_organization_write_own",
    "im_organization_write",
    "im_role_read",
    "im_role_write",
    "im_apikey_read",
    "im_apikey_write",
    "feat_im_all"
] as const

export type Permissions = typeof permissions[number]

export const mutablePermissions: Permissions[] = [...permissions]
