import { createContext, useContext } from "react";

export const UserContext = createContext<{
    userId: string
    username: string
}>({
    userId: '',
    username: ''
});

export const useUser = () => useContext(UserContext);