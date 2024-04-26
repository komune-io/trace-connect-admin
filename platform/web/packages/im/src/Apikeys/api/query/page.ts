import {QueryParams, useQueryRequest} from "@komune-io/g2";
import {useAuthenticatedRequest} from "../../config";
import { io } from "@komune-io/apikey-domain"

export interface ApiKeyPageQuery extends io.komune.im.apikey.domain.query.ApiKeyPageQueryDTO {}

export interface ApiKeyPageResult extends io.komune.im.apikey.domain.query.ApiKeyPageResultDTO {}

export const useApiKeyPageQueryFunction = (params: QueryParams<ApiKeyPageQuery, ApiKeyPageResult>) => {
    const requestProps = useAuthenticatedRequest()
    return useQueryRequest<ApiKeyPageQuery, ApiKeyPageResult>(
      "apiKeyPage", requestProps, params
    )
}
