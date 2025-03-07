import {User} from "connect-im";


export type ImMfaPasswordOtpFlowACR = "password-only" | "password-optional-otp" | "password-otp";


export const isPasswordOtpAcrActivated = (acr?: string) => {
  return acr === "password-otp"
}

export const isUserMfaEnable = (user: User) => {
  const mfa = user.mfa
  return mfa && mfa.length !== 0
}