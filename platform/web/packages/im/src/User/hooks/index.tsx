import { Chip } from "@komune-io/g2";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { LinkProps, useNavigate } from "react-router-dom";
import { G2ColumnDef } from "@komune-io/g2";
import { Row } from '@tanstack/react-table'
import {
  useExtendedAuth,
  useRoutesDefinition,
  TableCellAdmin,
  getUserRoleColor
} from "components";
import { User, useUserColumns, useUserDisable } from "connect-im";
import { useDeleteUserPopUp } from "./useDeleteUserPopUp";
import { useQueryClient } from "@tanstack/react-query";
import { usePolicies } from "../../Policies/usePolicies";


export const useUserListPage = () => {

  const { t } = useTranslation();
  const navigate = useNavigate()
  const { service } = useExtendedAuth()

  const policies = usePolicies()

  const { usersUserIdEdit, usersUserIdView, organizationsOrganizationIdView } = useRoutesDefinition()

  const userDisable = useUserDisable({
  })

  const getRowLink = useCallback(
    (row: Row<User>): LinkProps => ({
      to: usersUserIdView(row.original.id)
    }),
    [usersUserIdView],
  )

  const getOrganizationUrl = useCallback(
    (organizationId: string) => organizationsOrganizationIdView(organizationId),
    [organizationsOrganizationIdView],
  )

  const queryClient = useQueryClient()

  const onDeleteClick = useCallback(
    async (user: User) => {
      await userDisable.mutateAsync({
        id: user.id,
        anonymize: true
      })
      queryClient.invalidateQueries({ queryKey: ["userPage"] })
      queryClient.invalidateQueries({ queryKey: ["userGet"] })
    }, []
  )

  const base = useUserColumns({
    hasOrganizations: true,
    getOrganizationUrl,
  })

  const columns = useMemo((): G2ColumnDef<User>[] => {

    const columns: G2ColumnDef<User>[] = [
      base.columns.givenName, {
        header: t("role"),
        id: "role",
        cell: ({ row }) => {
          if (!row.original.roles) return
          //@ts-ignore
          return <Chip label={t("roles." + row.original.roles[0]?.identifier)} color={getUserRoleColor(row.original.roles[0])} />;
        },
      },
      ...(policies.user.canListAllUser ? [
        base.columns.memberOf as G2ColumnDef<User>
      ] : []),
      base.columns.email
    ]

    if (service.is_im_user_write()) {
      columns.push({
        header: t("actions"),
        id: "actions",
        cell: ({ row }) => {
          const declineConfirmation = useDeleteUserPopUp({ onDeleteClick: onDeleteClick })
          const handleDeleteClick = useCallback(
            (user: User) => {
              declineConfirmation.open(user);
            },
            [declineConfirmation]
          );

          return <><TableCellAdmin onDelete={() => handleDeleteClick(row.original)} onEdit={() => navigate(usersUserIdEdit(row.original.id))} />{declineConfirmation.popup}</>
        },
      })
    }
    return columns
  }, [service.getPrincipalRole, base.columns, policies.user.canListAllUser])

  return {
    getRowLink: getRowLink,
    columns
  }
}