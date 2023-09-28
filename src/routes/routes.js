import { createBrowserRouter } from "react-router-dom";
import Dashboard from "../components/Dashboard";
import Login from "../components/Login";
import EditForm from "../components/form/EditForm";

export const routes = createBrowserRouter([
    {
        path: '/',
        element: <Dashboard />
    }, {
        path: '/login',
        element: <Login />
    }, {
        path: '/form/:formId',
        element: <EditForm />
    }
])