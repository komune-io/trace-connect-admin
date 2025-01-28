import {useAuth, KeycloackService, AuthedUser} from "@komune-io/g2"
import {Permissions, mutablePermissions, usePermissionListQuery, useRoleListQuery,} from "./roles";
import { Routes, routesAuthorizations, RoutesRoles } from "./routes";
import { io as apiKey } from "@komune-io/im-apikey-domain"
import { io as organization } from "@komune-io/im-organization-domain"
import { io as user } from "@komune-io/im-user-domain"

type StaticServices = {
    hasUserRouteAuth: {
        returnType: boolean;
        paramsType: {
            route: Routes,
            authorizedUserId?: string
            authorizedUserOrgId?: string
        }
    }
}

const policies = {
    apiKey: apiKey.komune.im.apikey.domain.policies.ApiKeyPolicies,
    organization: organization.komune.im.f2.organization.domain.policies.OrganizationPolicies,
    user: user.komune.im.f2.user.domain.policies.UserPolicies
}

const staticServices: KeycloackService<StaticServices, Permissions> = {
    hasUserRouteAuth: (_, services, params) => {
        const { route = "", authorizedUserId, authorizedUserOrgId } = params ?? {}
        const authorizations = routesAuthorizations[route]
        if (authorizations === "open") return true

        const currentUser = services.getUser()
        const isAuthedUserId = !!authorizedUserId && currentUser?.id === authorizedUserId
        const isAuthedOrgId = !!authorizedUserOrgId && currentUser?.memberOf === authorizedUserOrgId
        return checkRelations(authorizations, currentUser, isAuthedUserId, isAuthedOrgId, services.hasRole)
    }
}

export const useExtendedAuth = () =>  {
    const auth = useAuth<StaticServices, Permissions, typeof policies>(mutablePermissions, staticServices, policies)
    const permissionsQuery = usePermissionListQuery({query:{}})
    const rolesQuery = useRoleListQuery({query:{}})
    return {
        ...auth,
        roles: rolesQuery.data?.items,
        permissions: permissionsQuery.data?.items
    }
}

const matches = (authorization: RoutesRoles, currentUser: AuthedUser | undefined, isAuthedUserId: boolean, isAuthedOrgId: boolean, hasRole: (roles: (Permissions)[]) => boolean) => {
    if (authorization === "currentUser") {
        return isAuthedUserId
    }
    if (authorization === "memberOf") {
        return isAuthedOrgId
    }
    if (authorization === "hasOrganization") {
        return !!currentUser?.memberOf
    }
    return hasRole([authorization])
}

const checkRelations = (authorizations: RoutesRoles[] | RoutesRoles[][], currentUser: AuthedUser | undefined, isAuthedUserId: boolean, isAuthedOrgId: boolean, hasRole: (roles: (Permissions)[]) => boolean) => {
    return authorizations.some((roles: any) => {
        if (Array.isArray(roles)) {
            return roles.every(role => matches(role, currentUser, isAuthedUserId, isAuthedOrgId, hasRole))
        } else {
            return matches(roles, currentUser, isAuthedUserId, isAuthedOrgId, hasRole)
        }
    })
}
