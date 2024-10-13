import { createContext, useContext, useEffect, useState } from "react";
import useFetch from './../hooks/useFetch';
import { getToken } from "../utils/Fetch";
import useToast from "@/hooks/useToast";
const UrlContext = createContext();

export const useUrlContext = () => useContext(UrlContext);

// eslint-disable-next-line react/prop-types
const UrlProvider = ({ children, position = "center-top" }) => {
    const token = getToken();
    console.log({tokenInCntext : token})
    const [toastPosition, setToastPosition] = useState(position);
    const options = {
        endpoint: '/user/profile',
    };
    let value = {};
    const { data, loading, error, fn: fetchUser } = useFetch({ ...options });
    const isAuthenticated = token !== null && token !== undefined;
    const { ToastComponent, triggerToast } = useToast(toastPosition);

    useEffect(() => {
        if (isAuthenticated) fetchUser();
    }, [token]);

    if (data?.status !== 401) {
        value = {
            isAuthenticated,
            user: data?.data,
            loading,
            error,
            fetchUser,
            isAdmin: data?.data?.isAdmin || false,
            triggerToast: (message, position = "center-top") => {
                setToastPosition(position);
                triggerToast(message);
            },
        };
    }

    return (
        <UrlContext.Provider value={value}>
            {children}
            {ToastComponent}
        </UrlContext.Provider>
    );
};

export default UrlProvider;
