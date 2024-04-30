import { QueryParams, useQueryRequest} from "@komune-io/g2";
import {useAuthenticatedRequest} from "../../config";
import { io } from "@komune-io/im-apikey-domain"

export interface ApiKeyGetQuery extends io.komune.im.apikey.domain.query.ApiKeyGetQueryDTO {}

export interface ApiKeyGetResult extends io.komune.im.apikey.domain.query.ApiKeyGetResultDTO {}

export const useApiKeyGetQuery = (params: QueryParams<ApiKeyGetQuery, ApiKeyGetResult>) => {
    const requestProps = useAuthenticatedRequest()
    return useQueryRequest<ApiKeyGetQuery, ApiKeyGetResult>(
      "apiKeyGet", requestProps, params
    )
}
