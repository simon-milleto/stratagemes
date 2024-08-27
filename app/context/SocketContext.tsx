import { createContext, useContext } from "react";

export const SocketConfigContext = createContext<{
    host: string
}>({
    host: ''
});

export const useSocketConfig = () => useContext(SocketConfigContext);