import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";


export const useRegister = () => {
    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const register = async (name: string, username: string, email: string, password: string) => {
        setIsLoading(true);
        setError("");
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    username,
                    email,
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
            console.error("Error registering user:", error);
            setError("An error occurred while registering the user");
            setIsLoading(false);
        }
    };

    const { dispatch } = useAuthContext();

    return {
        register,
        error,
        isLoading
    };
};