import {useExtendedAuth} from "components";
import {useMemo} from "react"
import {User} from "connect-im";

export interface UsePoliciesProps {
  myProfile ?: boolean,
  myOrganization?: boolean
}

export const usePolicies = (
  props?: UsePoliciesProps,
) => {
  const { service } = useExtendedAuth()


  const hasSuperAdminRights = service.is_im_organization_write()

  return useMemo(() => {
    const hasUserWrite = service.is_im_user_write()
    const hasOrganizationWrite = service.is_im_organization_write()
    const hasApiKeyWrite = service.is_im_apikey_write()
    console.log('props?.myOrganization', props?.myOrganization)
    console.log('hasUserWrite', hasUserWrite)
    console.log('hasOrganizationWrite', hasOrganizationWrite)
    console.log('hasApiKeyWrite', hasApiKeyWrite)
    return ({
      apiKeys: {
        canFilter: hasSuperAdminRights,
        canDelete: (hasSuperAdminRights || hasApiKeyWrite),
        canCreate: (hasSuperAdminRights || hasApiKeyWrite),
        canCreateForAllOrg: hasSuperAdminRights,
      },
      organization: {
        canViewList: hasSuperAdminRights,
        canCreate: hasSuperAdminRights,
        canUpdate: (hasSuperAdminRights || (hasOrganizationWrite && props?.myOrganization)),
        canUpdateRoles: hasSuperAdminRights,
        canDelete: hasSuperAdminRights,
        canVerify: hasSuperAdminRights,
      },
      user: {
        canCreate: (hasSuperAdminRights || hasUserWrite || props?.myProfile),
        canUpdate: (hasSuperAdminRights || hasUserWrite || props?.myProfile),
        canUpdateRole: ((hasSuperAdminRights && !props?.myProfile) || (hasUserWrite && props?.myOrganization)),
        canUpdateOrganization: hasSuperAdminRights,
        canDelete: hasSuperAdminRights || hasUserWrite,
        canListAllUser: hasSuperAdminRights
      }
    })
  }, [service, props])
}

export interface UseUserPoliciesProps {
  user?: User
}

export const useUserPolicies = (
  props: UseUserPoliciesProps,
) => {
  const { service, policies } = useExtendedAuth()
  const { user } = props

  return useMemo(() => {
    return ({
      canCreate: policies.user.canCreate(),
      canUpdate: user && policies.user.canUpdate(user),
      canUpdateRole: user && policies.user.canUpdateRole(),
      canUpdateOrganization: policies.user.canUpdateMemberOf(),
      canDelete: user && policies.user.canDelete(user),
      canListAllUser: policies.user.canPage()
    })
  }, [service, props])
}