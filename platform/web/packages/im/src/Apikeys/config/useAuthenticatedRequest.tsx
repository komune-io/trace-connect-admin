import { useExtendedAuth } from "components";
import { RequestProps } from "@komune-io/g2";
import { useMemo } from "react";
import { i2Config } from '@komune-io/g2-providers'
import { fsConfig } from "@komune-io/g2";


export const useNoAuthenticatedRequest = (): RequestProps => {
  return useMemo(() => ({
    url: i2Config().url,
  }), [])
}

export const useAuthenticatedRequest = (endpoint: "im" | "fs" = "im"): RequestProps => {
  const auth = useExtendedAuth()
  return useMemo(() => ({
    url: endpoint === "fs" ? fsConfig().url : i2Config().url,
    jwt: auth.keycloak.token
  }), [auth.keycloak.token])
}
