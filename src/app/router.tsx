import {createBrowserRouter} from "react-router-dom";
import AuthedLayout from "./layouts/AuthedLayout.tsx";
import GuestLayout from "./layouts/GuestLayout.tsx";
import GagarinPage from "../pages/(authed)/gagarin";
import MissionsPage from "../pages/(authed)/missions";
import LoginPage from "../pages/(guest)/login";
import LogoutPage from "../pages/(authed)/logout";
import RegisterPage from "../pages/(guest)/register";
import RacesPage from "../pages/(authed)/races";
import RacesAdd from "../pages/(authed)/races/add";
import SearchPage from "../pages/(authed)/search";
import AddMissionsPage from "../pages/(authed)/missions/add";

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthedLayout/>,
    children: [
      {
        path: '/gagarin',
        element: <GagarinPage/>
      },
      {
        path: '/missions',
        element: <MissionsPage/>
      },
      {
        path: '/missions/add',
        element: <AddMissionsPage/>
      },
      {
        path: '/missions/:id/edit',
        element: <></>
      },
      {
        path: '/races',
        element: <RacesPage/>
      },
      {
        path: '/races/add',
        element: <RacesAdd/>
      },
      {
        path: '/search',
        element: <SearchPage/>
      },
      {
        path: '/logout',
        element: <LogoutPage/>
      },
    ]
  },
  {
    path: '/',
    element: <GuestLayout/>,
    children: [
      {
        path: '/login',
        element: <LoginPage/>
      },
      {
        path: '/register',
        element: <RegisterPage/>
      }
    ]
  }
])