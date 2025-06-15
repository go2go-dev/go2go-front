import { createBrowserRouter } from "react-router-dom";
import Layout from "./layouts/Layout";
import BottomLayout from "./layouts/BottomLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ErrorPage from "./pages/ErrorPage";

export const router = createBrowserRouter([
	{
		path: "/",
		element: <Layout />,
		errorElement: <ErrorPage />,
		children: [
			{
				index: true,
				element: <Home />,
			},
			{
				path: "login",
				element: <Login />,
			},
			{
				path: "register",
				element: <Register />,
			},
			{
				element: <BottomLayout />,
				children: [],
			},
		],
	},
]);
