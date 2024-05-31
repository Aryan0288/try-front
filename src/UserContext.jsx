import axios from "axios";
import { createContext, useEffect, useState } from "react";
// import dotenv from 'dotenv'
// dotenv.config();
export const UserContext = createContext({});

export function UserContextProvider({ children }) {

    const [username, setUsername] = useState();
    const [id, setId] = useState();
    const [email, setEmail] = useState();
    const [oneTimePass, setOneTimePass] = useState();
    const [newMessageText, setNewMessageText] = useState('');
   

    // profile fetch function
    // const fetchProfile = async () => {
    //     try { 
    //         const res=localStorage.getItem("token");
    //         const response=JSON.parse(res);
    //         setId(response.id);
    //         setUsername(response.username);
    //         setEmail(response.email);
    //         return;
    //     } catch (err) {
    //         console.log("error Occur during fetch profile data : ", err.message);
    //         return;
    //     }
    // }
    // useEffect(() => {
    //     fetchProfile();
    // }, [])


    useEffect(() => {
        axios.get('./profile').then(response => {
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
        setEmail,
        oneTimePass,
        setOneTimePass,
        newMessageText,
        setNewMessageText
    }


    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}