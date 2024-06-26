import { PotentialError } from '@komune-io/g2'

export const siretValidation = (
  value?: string,
  readOnly?: boolean
): PotentialError => {
  if (readOnly) return undefined
  const trimmed = value?.trim()
  if (!!trimmed && trimmed?.length !== 14 && trimmed?.length !== 0)
    return 'un numéro de siret doit être composé de 14 chiffres'
  return
}
