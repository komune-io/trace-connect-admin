import {CommandParams, useCommandRequest} from "@komune-io/g2";
import {useAuthenticatedRequest} from "../../config";
import { io } from "@komune-io/apikey-domain"

export interface ApikeyRemoveCommand extends io.komune.im.apikey.domain.command.ApikeyRemoveCommandDTO {}

export interface ApikeyRemoveEvent extends io.komune.im.apikey.domain.command.ApikeyRemoveEventDTO {}

export type ApikeyRemoveFunctionOptions = Omit<CommandParams<ApikeyRemoveCommand, ApikeyRemoveEvent>,
    'jwt' | 'apiUrl'
>
export const useApikeyRemoveFunction = (params?: ApikeyRemoveFunctionOptions) => {
    const requestProps = useAuthenticatedRequest()
    return useCommandRequest<ApikeyRemoveCommand, ApikeyRemoveEvent>(
        "apiKeyRemove", requestProps, params
    )
}