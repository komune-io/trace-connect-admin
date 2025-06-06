import { Link, LinkProps } from "react-router-dom";
import { useMemo } from "react";
import { MenuItems } from '@komune-io/g2'
import { useLocation } from "react-router";
import {
    SupervisedUserCircle,
    Business,
    AccountCircle, Login,
    Logout, VpnKeyRounded, Folder
} from '@mui/icons-material';
import { TFunction } from "i18next";
import {config, useExtendedAuth, useRoutesDefinition} from "components";
import {Avatar} from "@mui/material";

interface MenuItem {
    key: string,
    to?: string,
    action?: () => void,
    label: string
    icon: JSX.Element;
    isVisible?: boolean;
    isSelected?: boolean;
}

export const getMenu = (location: string, menu: MenuItem[]): MenuItems<LinkProps>[] => {
    const finalMenu: MenuItems<LinkProps>[] = []
    menu.forEach((item): MenuItems<LinkProps> | undefined => {
        const additionals = item.to ? {
            component: Link,
            componentProps: {
                to: item.to
            }
        } : {
            goto: item.action
        }
        if (item.isVisible === false) return
        finalMenu.push({
            key: `appLayout-${item.key}`,
            label: item.label,
            icon: item.icon,
            isSelected: item.isSelected ?? (item.to ? item.to === "/" ? item.to === location : location.includes(item.to) : false),
            ...additionals
        })
    })
    return finalMenu
}

export const useMenu = (t: TFunction) => {
    const location = useLocation()
    const {service} = useExtendedAuth()
    const {organizations, users, myOrganization, apiKeys, files} = useRoutesDefinition()
    const menu: MenuItem[] = useMemo(() => [
    ...(service.is_im_organization_write() ? [{
        key: "organizations",
        to: "/",
        label: t("organizations"),
        icon: <Business />,
        isVisible: service.hasUserRouteAuth({route: "organizations"}),
        isSelected: location.pathname === "/" || location.pathname.includes(organizations())
    } as MenuItem] : [{
        key: "myOrganization",
        to: "/",
        label: t("account"),
        icon: <AccountCircle />,
        isVisible: service.hasUserRouteAuth({route: "myOrganization"}),
        isSelected: location.pathname === "/" || location.pathname.includes(myOrganization())
    } as MenuItem]),
     {
        key: "users",
        to: users(),
        label: t("users"),
        icon: <SupervisedUserCircle />,
        isVisible: service.hasUserRouteAuth({route: "users"}) && service.is_im_user_read()
    },{
        key: "apiKeys",
        to: apiKeys(),
        label: t("apiKeys"),
        icon: <VpnKeyRounded />,
        isVisible: service.hasUserRouteAuth({route: "apiKeys"})

    }, {
        key: "files",
        to: files(),
        label: t("files"),
        icon: <Folder />,
        isVisible: service.hasUserRouteAuth({route: "files"})
    }], [t, service.hasUserRouteAuth, location.pathname])
    return useMemo(() => getMenu(location.pathname, menu), [location.pathname, menu])
}

export const useUserMenu = (logout: () => void, login: () => void, t: TFunction) => {
    const location = useLocation()
    const { service } = useExtendedAuth()
    const { myProfil } = useRoutesDefinition()
    const { applications = [] } = config()
    const actions: MenuItem[] = useMemo(() => {
        return applications.map((app) => ({
            key: app.id,
            label: app.name,
            icon: (<Avatar alt="App Icon" src={app.icon} variant="square"  sx={{ width: 24, height: 24 }} />),
            action: () => window.location.href = app.url,
        }))
    }, [])
    const loggedMenu: MenuItem[] = useMemo(() => [{
        key: "profil",
        to: myProfil(),
        label: t("profil"),
        icon: <AccountCircle />,
        isVisible: service.hasUserRouteAuth({route: "myProfil"})
    },
    ...actions,
    {
        key: "logout",
        action: logout,
        label: t("logout"),
        icon: <Logout />
    }], [logout, t])

    const notLoggedMenu: MenuItem[] = useMemo(() => [{
        key: "login",
        action: login,
        label: t("login"),
        icon: <Login />
    }], [Login, t, service.hasUserRouteAuth])

    return {
        loggedMenu: useMemo(() => getMenu(location.pathname, loggedMenu), [location.pathname, loggedMenu]),
        notLoggedMenu: useMemo(() => getMenu(location.pathname, notLoggedMenu), [location.pathname, notLoggedMenu])
    }
}

