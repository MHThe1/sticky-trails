import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";


export const useLogin = () => {
    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const login = async (identifier: string, password: string) => {
        setIsLoading(true);
        setError("");
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    identifier,
                    password,
                }),
            });
            const data = await response.json();
            console.log(data);
            if (response.ok) {
                // save user to local storage
                localStorage.setItem("user", JSON.stringify(data));

                // dispatch login action
                dispatch({ type: "LOGIN", payload: data });

                setIsLoading(false);
            } else {
                setError(data.error);
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Error logging in user:", error);
            setError("An error occurred while logging in the user");
            setIsLoading(false);
        }
    };

    const { dispatch } = useAuthContext();

    return {
        login,
        error,
        isLoading
    };
};