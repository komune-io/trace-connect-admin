import {CommandParams, useCommandRequest} from "@komune-io/g2";
import {useAuthenticatedRequest} from "../../config";
import { io } from "@komune-io/im-apikey-domain"

export interface ApiKeyAddCommand extends io.komune.im.apikey.domain.command.ApiKeyOrganizationAddCommandDTO {}

export interface ApiKeyAddedEvent extends io.komune.im.apikey.domain.command.ApiKeyAddedEventDTO {}

export type ApiKeyAddFunctionOptions = Omit<CommandParams<ApiKeyAddCommand, ApiKeyAddedEvent>,
    'jwt' | 'apiUrl'
>

export const useApiKeyAddFunction = (params?: ApiKeyAddFunctionOptions) => {
    const requestProps = useAuthenticatedRequest()
    return useCommandRequest<ApiKeyAddCommand, ApiKeyAddedEvent>(
        "apiKeyCreate", requestProps, params
    )
}
