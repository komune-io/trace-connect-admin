import {NoMatchPage, Router, useAuth} from "@komune-io/g2";
import { Route, useParams, useSearchParams } from "react-router-dom";
import { Routes, useExtendedAuth } from "components";
import { App } from "App";
import {
  OrganizationCreationPage,
  OrganizationListPage,
  OrganizationProfilePage,
  OrganizationUpdatePage,
  UserCreationPage,
  UserListPage,
  UserProfilePage,
  UserUpdatePage,
} from "im"
import {useMemo} from "react"
import {ApikeyListPage} from "im/src/Apikeys/page/list";
import {ApiKeyAddPage} from "im/src/Apikeys/page/add";
import {FileListPage} from "im/src/ManageFiles/page/list"


const imPages: PageRoute[] = [{
  path: "organizations",
  element: <OrganizationListPage />
}, {
  path: "organizations/add",
  element: <OrganizationCreationPage />
}, {
  path: "organizations/:organizationId/view",
  element: <OrganizationProfilePage  />
}, {
  path: "organizations/:organizationId/edit",
  element: <OrganizationUpdatePage />
}, {
  path: "myOrganization",
  element: <OrganizationProfilePage myOrganization />
}, {
  path: "myOrganization/edit",
  element: <OrganizationUpdatePage myOrganization />
}, {
  path: "users",
  element: <UserListPage />
}, {
  path: "users/add",
  element: <UserCreationPage />
}, {
  path: "users/:userId/view",
  element: <UserProfilePage  />
}, {
  path: "users/:userId/edit",
  element: <UserUpdatePage />
}, {
  path: "myProfil",
  element: <UserProfilePage myProfile />
}, {
  path: "myProfil/mfa/activate",
  element: <UserProfilePage myProfile mfa="activate" />
}, {
  path: "myProfil/mfa/disable",
  element: <UserProfilePage myProfile mfa="disable" />
}, {
  path: "myProfil/edit",
  element: <UserUpdatePage myProfile />
}, {
  path: "apiKeys",
  element: <ApikeyListPage />
},
{
  path: "apiKeys/add",
  element: <ApiKeyAddPage readOnly={false} />
},
{
  path: "files",
  element: <FileListPage />
},
{
  path: "files/*",
  element: <FileListPage />
}]

const allPages: PageRoute[] = [...imPages]

export const AppRouter = () => {
  const pages = useMemo(() => allPages.map((page) => GenerateRoute(page)), [])
  const { service } = useAuth()
  const memberOf = service.getUser()?.memberOf
  const {policies} = useExtendedAuth()
  const element = useMemo(() => {
    if (policies.organization.canList()) return <OrganizationListPage />
    if (memberOf) return <OrganizationProfilePage myOrganization />
    return <UserProfilePage myProfile />
  }, [memberOf, policies.organization])
  return (
    <Router>
      <Route path="/" element={<App />} >
        <Route path="" element={element} />
        {pages}
      </Route >
    </Router>
  );
};

export interface PageRoute {
  path: Routes
  element: JSX.Element
}

export const GenerateRoute = (props: PageRoute) => {
  const { element, path } = props
  return (
    <Route key={path} path={path} element={
      <PrivateElement route={path}>
        {element}
      </PrivateElement>
    } />
  )
}

export const PrivateElement = (props: { route: Routes, children: JSX.Element }) => {
  const { service } = useExtendedAuth()
  const { userId, organizationId } = useParams()
  const [searchParams] = useSearchParams()
  if (!service.hasUserRouteAuth({ route: props.route, authorizedUserId: searchParams.get("userId") ?? userId, authorizedUserOrgId: searchParams.get("organizationId") ?? organizationId })) return <NoMatchPage />
  return props.children;
}