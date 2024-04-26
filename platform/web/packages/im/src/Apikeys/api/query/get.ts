import { QueryParams, useQueryRequest} from "@komune-io/g2";
import {useAuthenticatedRequest} from "../../config";
import { city } from "@komune-io/apikey-domain"

export interface ApiKeyGetQuery extends city.smartb.im.apikey.domain.query.ApiKeyGetQueryDTO {}

export interface ApiKeyGetResult extends city.smartb.im.apikey.domain.query.ApiKeyGetResultDTO {}

export const useApiKeyGetQuery = (params: QueryParams<ApiKeyGetQuery, ApiKeyGetResult>) => {
    const requestProps = useAuthenticatedRequest()
    return useQueryRequest<ApiKeyGetQuery, ApiKeyGetResult>(
      "apiKeyGet", requestProps, params
    )
}
