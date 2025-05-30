import { Box, InputLabel, Typography } from '@mui/material'
import {
  Action,
  BasicProps,
  Link,
  MergeMuiElementProps,
  PopUp
} from '@komune-io/g2'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useUserResetPassword } from '../../Api'
import {
  UserResetPasswordFormAutomated,
  UserResetPasswordFormAutomatedProps
} from './UserResetPasswordFormAutomated'
import { useTranslation } from 'react-i18next'

export interface ChosenResetPasswordBasicProps extends BasicProps {
  /**
   * The type of the reset password
   *
   * @defautl 'email'
   */
  resetPasswordType?: 'email' | 'forced'
}

export type ChosenResetPasswordProps = MergeMuiElementProps<
  UserResetPasswordFormAutomatedProps,
  ChosenResetPasswordBasicProps
>

export const ChosenResetPassword = (props: ChosenResetPasswordProps) => {
  const {
    resetPasswordType = 'email',
    userId,
    userUpdatePasswordOptions,
    ...other
  } = props
  const [open, setOpen] = useState(false)
  const [mutating, setMutating] = useState(false)
  const [error, setError] = useState(false)
  const submitRef = useRef<HTMLButtonElement>(null)
  const { t } = useTranslation()

  const onToggle = useCallback(() => {
    setOpen((open) => !open)
  }, [])

  const onSuccess = useCallback(
    //@ts-ignore
    (data, variables, context) => {
      setMutating(false)
      onToggle()
      userUpdatePasswordOptions?.onSuccess?.(data, variables, context)
    },
    [onToggle, userUpdatePasswordOptions?.onSuccess]
  )

  const onMutate = useCallback(
    //@ts-ignore
    (variables) => {
      setMutating(true)
      userUpdatePasswordOptions?.onMutate?.(variables)
    },
    [userUpdatePasswordOptions?.onMutate]
  )

  const onError = useCallback(
    //@ts-ignore
    (error, variables, context) => {
      setMutating(false)
      setError(true)
      userUpdatePasswordOptions?.onError?.(error, variables, context)
    },
    [userUpdatePasswordOptions?.onError]
  )

  const userResetPassword = useUserResetPassword({
    options: {
      ...userUpdatePasswordOptions,
      onMutate,
      onSuccess,
      onError
    }
  })

  const actions = useMemo(
    (): Action[] => [
      {
        label: t('g2.cancel'),
        key: 'cancelPopupButton',
        onClick: onToggle,
        variant: 'text'
      },
      {
        label: t('g2.confirm'),
        key: 'confirmPopupButton',
        ref: submitRef,
        isLoading: mutating,
        fail: error,
        onClick: () => {
          if (resetPasswordType === 'email') {
            userResetPassword.mutate({ id: userId })
          }
        }
      }
    ],
    [onToggle, mutating, error, t, userId]
  )

  return (
    <Box>
      <InputLabel
        sx={{
          marginBottom: (theme) => theme.spacing(1),
          fontSize: '0.875rem',
          fontWeight: 600,
          color: '#000000'
        }}
      >
        {t('g2.password')}
      </InputLabel>
      <Link onClick={onToggle} sx={{ color: '#1E88E5', cursor: 'pointer' }}>
        {t('g2.changePassword')}
      </Link>
      <PopUp onClose={onToggle} open={open} actions={actions}>
        <Typography variant='h6' style={{ marginBottom: '15px' }}>
          {t('g2.passwordChangement')}
        </Typography>
        {resetPasswordType === 'email' ? (
          <Typography variant='body1'>{t('g2.passwordEmail')}</Typography>
        ) : (
          <UserResetPasswordFormAutomated
            userUpdatePasswordOptions={{
              ...userUpdatePasswordOptions,
              onMutate,
              onSuccess,
              onError
            }}
            SubmitButtonRef={submitRef}
            userId={userId}
            {...other}
          />
        )}
      </PopUp>
    </Box>
  )
}
