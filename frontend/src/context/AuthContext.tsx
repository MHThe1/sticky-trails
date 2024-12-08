import { createContext, useContext, useEffect, useReducer, ReactNode, Dispatch } from "react";

interface User {
  username: string;
  email: string;
  token: string;
}

// Define the shape of the state
interface AuthState {
  user: User | null;
}

// Define the possible action types
type AuthAction =
  | { type: "LOGIN"; payload: User }
  | { type: "LOGOUT" };

// Create the context type
interface AuthContextType extends AuthState {
  dispatch: Dispatch<AuthAction>;
}

// Create the context with a default value of `null`
export const AuthContext = createContext<AuthContextType | null>(null);

// Reducer function
export const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN":
      return { user: action.payload };
    case "LOGOUT":
      return { user: null };
    default:
      return state;
  }
};

// Props type for the provider
interface AuthContextProviderProps {
  children: ReactNode;
}

// AuthContextProvider component
export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
  });

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      dispatch({ type: "LOGIN", payload: JSON.parse(user) });
    }
  }, []);

  console.log("AuthContext state: ", state);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use the AuthContext
export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthContextProvider");
  }
  return context;
};
