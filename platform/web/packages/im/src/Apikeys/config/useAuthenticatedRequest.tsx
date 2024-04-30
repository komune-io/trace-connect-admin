import { useExtendedAuth } from "components";
import { RequestProps } from "@komune-io/g2";
import { useMemo } from "react";
import { imConfig } from '@komune-io/g2-providers'
import { fsConfig } from "@komune-io/g2";


export const useNoAuthenticatedRequest = (): RequestProps => {
  return useMemo(() => ({
    url: imConfig().url,
  }), [])
}

export const useAuthenticatedRequest = (endpoint: "im" | "fs" = "im"): RequestProps => {
  const auth = useExtendedAuth()
  return useMemo(() => ({
    url: endpoint === "fs" ? fsConfig().url : imConfig().url,
    jwt: auth.keycloak.token
  }), [auth.keycloak.token])
}
