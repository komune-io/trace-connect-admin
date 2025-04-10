import { useCallback, useMemo } from 'react'
import {
  QueryKey,
  useQuery,
  useQueryClient,
  UseQueryOptions
} from '@tanstack/react-query'
import { OrganizationRef } from '../Domain'
import { imConfig, request } from '@komune-io/g2'

export interface OrganizationRefsAllQuery {}

export interface OrganizationRefsAllResult {
  items: OrganizationRef[]
}

export type GetOrganizationRefsOptions<
  R extends QueryKey = OrganizationRefsAllQuery[]
> = Omit<
  UseQueryOptions<
    OrganizationRefsAllResult,
    unknown,
    OrganizationRefsAllResult,
    R
  >,
  'queryKey' | 'queryFn'
>

export interface OrganizationRefsAllParams<
  R extends QueryKey = OrganizationRefsAllQuery[]
> {
  queryKey?: string
  jwt?: string
  options?: GetOrganizationRefsOptions<R>
}

export const useGetOrganizationRefs = (params?: OrganizationRefsAllParams) => {
  const { jwt, options, queryKey = 'organizationRefs' } = params ?? {}

  const getOrganizationRefs = useCallback(fetchOrganizationRefs(jwt), [jwt])
  const query = useQuery({
    queryKey: [queryKey], 
    queryFn: getOrganizationRefs, 
    ...options
  })

  const map = useMemo(() => {
    if (query.data?.items) {
      return new Map(query.data.items.map((o) => [o.id, o]))
    }
    return new Map<string, OrganizationRef>()
  }, [query.data])

  return {
    query: query,
    map: map
  }
}

export const usePrefetchOrganizationRefs = async (
  params?: OrganizationRefsAllParams<[string]>
) => {
  const { jwt, options, queryKey = 'organizationRefs' } = params ?? {}
  const getOrganizationRefs = useCallback(fetchOrganizationRefs(jwt), [jwt])
  const queryClient = useQueryClient()
  queryClient.prefetchQuery({
    queryKey: [queryKey], 
    queryFn: getOrganizationRefs, 
    ...options
  })
}

const fetchOrganizationRefs =
  (jwt?: string) => async (): Promise<OrganizationRefsAllResult> => {
    const res = await request<OrganizationRefsAllResult[]>({
      url: `${imConfig().url}/organizationRefList`,
      method: 'POST',
      body: '[{}]',
      jwt: jwt
    })
    if (res) {
      return {
        items: res[0]?.items || []
      }
    } else {
      return {
        items: []
      }
    }
  }
