import { useAuthenticatedRequest } from '@komune-io/g2-providers'
import { OrganizationId } from '../Domain'
import {
  CommandParams,
  useCommandRequest
} from '@komune-io/g2-utils'

export interface OrganizationDisableCommand {
  id: OrganizationId
  disabledBy?: string
  anonymize: Boolean
  attributes?: Record<string, string>
  userAttributes?: Record<string, string>
}

export interface OrganizationDisabledEvent {
  id: OrganizationId
  userIds: string[]
}

export const useOrganizationDisable = (
  params: CommandParams<OrganizationDisableCommand, OrganizationDisabledEvent>
) => {
  const requestProps = useAuthenticatedRequest("im")
  return useCommandRequest<
    OrganizationDisableCommand,
    OrganizationDisabledEvent
  >('organizationDisable', requestProps, params)
}