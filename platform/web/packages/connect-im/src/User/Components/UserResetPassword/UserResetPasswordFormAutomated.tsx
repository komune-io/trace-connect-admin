import { useCallback } from 'react'
import { BasicProps, CommandOptions, MergeMuiElementProps } from '@komune-io/g2'
import { UserId, UserResetPasswordCommand, UserUpdatePasswordCommand, UserUpdatePasswordResult } from '../../Domain'
import {
  UserResetPasswordForm,
  UserResetPasswordFormProps
} from './UserResetPasswordForm'
import { useUserUpdatePassword } from '../..'

export interface UserResetPasswordFormAutomatedBasicProps extends BasicProps {
  /**
   * The id of the user
   */
  userId: UserId
  /**
   * The userUpdatePassword hook options
   */
  userUpdatePasswordOptions?: CommandOptions<UserResetPasswordCommand, UserUpdatePasswordResult>
}

export type UserResetPasswordFormAutomatedProps = MergeMuiElementProps<
  UserResetPasswordFormProps,
  UserResetPasswordFormAutomatedBasicProps
>

export const UserResetPasswordFormAutomated = (
  props: UserResetPasswordFormAutomatedProps
) => {
  const { userId, userUpdatePasswordOptions, ...other } = props

  const userUpdatePassword = useUserUpdatePassword({
    options: userUpdatePasswordOptions
  })

  const handleResetPasswordSubmit = useCallback(
    async (cmd: UserUpdatePasswordCommand) => {
      const result = await userUpdatePassword.mutateAsync(cmd)
      return !!result
    },
    [userUpdatePassword.mutateAsync]
  )

  return (
    <UserResetPasswordForm
      userId={userId}
      onSubmit={handleResetPasswordSubmit}
      {...other}
    />
  )
}
