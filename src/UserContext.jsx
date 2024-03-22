import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {

    const [username, setUsername] = useState();
    const [id, setId] = useState();
    const [email, setEmail] = useState();

    useEffect(() => {
        axios.get('./profile').then(response => {
            // console.log("fetch profile : ",response);
            // console.log("id : ",response.data.id);
            // console.log("username : ",response.data.username);
            // console.log("email : ",response.data.email);

            setId(response.data.id);
            setUsername(response.data.username);
            setEmail(response.data.email);
        });
    }, [])

    const value = {
        username,
        setUsername,
        id,
        setId,
        email,
        setEmail
    }


    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}