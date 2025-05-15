import { useLocation, Navigate } from "react-router-dom";
import ApiService from "../api/ApiService";



export const AuthRoute = ({element: Component}) => {
    const location = useLocation();
    return ApiService.isAthenticated() ? (
        Component
    ):(
        <Navigate to="/login" replace state={{ from: location }} />
    )
}