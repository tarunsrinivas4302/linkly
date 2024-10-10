import { Fetch } from "@/utils/Fetch";
import { useState } from "react";

function useFetch({ ...options }) {
    const [loading, setIsLoading] = useState(false);
    const [error, setIsError] = useState("");
    const [data, setData] = useState(null);

    const fn = async (args) => {
        console.log({ args })
        setIsLoading(true);
        setIsError("");
        setData(null);  // Reset data when a new fetch starts
        try {
            const response = await Fetch({ ...options, ...args });
            if (response?.success) {
                setData(response);
            } else {
                throw new Error(response?.message || 'Failed to fetch data');
            }
        } catch (error) {
            setIsError(error.message); // Set the error message properly
        } finally {
            setIsLoading(false);
        }
    }

    return {
        loading, error, data, fn
    }
}

export default useFetch;
