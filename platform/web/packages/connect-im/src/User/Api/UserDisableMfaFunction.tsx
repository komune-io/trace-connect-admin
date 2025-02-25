import { useAuthenticatedRequest } from '@komune-io/g2'
import { UserId } from '../Domain'
import {
  CommandParams,
  useCommandRequest
} from '@komune-io/g2'

export interface UserDisableMfaCommand {
  id: UserId
}

export interface UserDisabledMfaEvent {
  id: UserId
}

export const useUserDisableMfa = (
  params: CommandParams<UserDisableMfaCommand, UserDisabledMfaEvent>
) => {
  const requestProps = useAuthenticatedRequest("im")
  return useCommandRequest<UserDisableMfaCommand, UserDisabledMfaEvent>(
    'userDisableMfa',
    requestProps,
    params
  )
}
