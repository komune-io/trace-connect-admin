import { UserId } from '../Domain'
import {
  CommandParams,
  useAuthenticatedRequest,
  useCommandRequest
} from '@komune-io/g2'

export interface UserDisableCommand {
  id: UserId
  disabledBy?: UserId
  anonymize: Boolean
  attributes?: Record<string, string>
}

export interface UserDisabledEvent {
  id: UserId
  userIds: string[]
}

export const useUserDisable = (
  params: CommandParams<UserDisableCommand, UserDisabledEvent>
) => {
  const requestProps = useAuthenticatedRequest("im")
  return useCommandRequest<UserDisableCommand, UserDisabledEvent>(
    'userDisable',
    requestProps,
    params
  )
}
