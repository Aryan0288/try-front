import React, { useContext, useEffect, useRef, useState } from 'react'
import Avatar from './Avatar';
import Logo from './Logo';
import { uniqBy } from 'lodash'
import axios from 'axios'
import './index.css'

import { UserContext } from './UserContext';
import Contact from './Contact';
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom';
import FreeSoloCreateOptionDialog from './FreeSoloCreateOptionDialog';

export default function Chat() {
    const [ws, setWs] = useState(null);
    const [onlinePeople, setOnlinePeople] = useState({});
    const [offlinePeople, setOfflinePeople] = useState({});
    const [selectedUserId, setSelectedUserId] = useState(null);
    // const [newMessageText, setNewMessageText] = useState('');
    const [messages, setMessages] = useState([]);
    const [messageId, setMessagesId] = useState("");
    const [checkToken, setCheckToken] = useState();

    const messagesBoxRef = useRef();
    const { username, id, setId, setUsername, newMessageText, setNewMessageText } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        connectToWs();
        // console.log("this is ws connector");
    }, [selectedUserId])

    function connectToWs() {
        // const ws = new WebSocket('ws://localhost:4000');
        const ws = new WebSocket('wss://try-backend-ouni.onrender.com');


        setWs(ws);
        ws.addEventListener('message', handleMessage);
        ws.addEventListener('close', () => {
            setTimeout(() => {
                connectToWs();
            }, 1000);
        })
    }

    function ShowOnlinePeople(peopleArray) {
        const people = {};
        peopleArray.forEach(({ userId, username }) => {

            if (username) {
                people[userId] = username;
            }
        });
        setOnlinePeople(people);
    }


    function handleMessage(ev) {
        const messageData = JSON.parse(ev.data);
        if ('online' in messageData) {
            // console.log("messageData : ", messageData.online);
            ShowOnlinePeople(messageData.online);
        } else if ('text' in messageData) {
            if (messageData.sender === selectedUserId) {
                setMessages(prev => ([...prev, { ...messageData }]));
            }
        }
    }

    function logout() {
        try {
            axios.post('/logout').then(() => {
                setWs(null);
                setId(null);
                setUsername(null);
            })
            localStorage.removeItem("token");
            toast.success(`Successfully Logout`);
            navigate("/Login");
        } catch (err) {
            console.log("error during logout ", err.message);
            return res.status(500).json({ status: false, message: err.message });
        }
    }

    // Handle the send files
    async function sendMessage(ev, file = null) {
        if (ev) ev.preventDefault();
        if (newMessageText && newMessageText.length > 100) {
            toast.error("Message is too long");
            return;
        }
        if (!file && (!newMessageText || newMessageText.length === 0)) {
            toast.warning("Cannot send empty message");
            return;
        }
        // console.log("messgae : ",newMessageText);
        // console.log("file : ",file);
        ws.send(JSON.stringify({
            recipient: selectedUserId,
            text: newMessageText,
            file,
        }));

        if (file) {
            // old fetch data
            // await axios.get('/messages/' + selectedUserId + "/" + id).then(res => {
            //     console.log("res data : ", res.data);
            //     setMessages(res.data);
            // }) 
            // new code to fetch messages
            // await axios.get('/messages/' + selectedUserId).then(res => {
            //     console.log("res.data : ", res.data);
            //     setMessages(res.data);
            // });

            setMessages(prev => ([...prev, {
                text: newMessageText,
                sender: id,
                file: file.name,
                recipient: selectedUserId,
                _id: Date.now(),
            }]));
        } else {
            setNewMessageText('');
            setMessages(prev => ([...prev, {
                text: newMessageText,
                sender: id,
                recipient: selectedUserId,
                _id: Date.now(),
            }]));
        }

        setNewMessageText('');
    }

    // file send function
    function sendFile(ev) {

        const reader = new FileReader();
        reader.readAsDataURL(ev.target.files[0]);
        reader.onload = () => {
            sendMessage(null, {
                name: ev.target.files[0].name,
                data: reader.result,
            });
        };
    }



    const handleDelete = async (mess) => {

        try {

            setMessagesId(mess._id);
            // console.log(messages.length);
            const filteredPeople = messages.filter((item) => item._id !== mess._id);
            setMessages(filteredPeople);

            const response = await axios.delete(`/messages/${mess._id}`);
        } catch (error) {
            console.error(error);
        }
    };





    useEffect(() => {
        const div = messagesBoxRef.current;
        if (div) {
            div.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }, [messages])




    useEffect(() => {
        // console.log("new fetch api here");
        axios.get('/people').then(res => {
            const offlinePeopleArr = res.data
                .filter(p => p._id !== id)
                .filter(p => !Object.keys(onlinePeople).includes(p._id));

            const offlinePeople = {};
            offlinePeopleArr.forEach(p => {
                offlinePeople[p._id] = p;
            })
            // console.log(offlinePeople);
            setOfflinePeople(offlinePeople);
        });
    }, [onlinePeople]);
    const [recipientUsername, setRecipientUsername] = useState("");
    useEffect(() => {
        if (selectedUserId) {
            // axios.get('/messages/' + selectedUserId + "/" + id).then(res => {
            //     // console.log("data is here ", res)
            //     setMessages(res.data);
            // })

            // new code to fetch messages
            axios.get('/messages/' + selectedUserId).then(res => {
                setMessages(res.data.data);
                setRecipientUsername(res.data.info[0].username);
            });
        }
    }, [selectedUserId, setMessages]);

    const onlinePeopleExclOurUser = { ...onlinePeople };

    delete onlinePeopleExclOurUser[id];
    const messagesWithoutDupes = uniqBy(messages, '_id');



    const [dropdownVisible, setDropdownVisible] = useState(false);

    // Function to toggle the dropdown visibility
    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    // Function to handle delete action
    const handleDeleteOption = (action) => {
        if (action === 'deleteForMe') {
            console.log('Deleting for me...');
        } else if (action === 'deleteEveryone') {
            console.log('Deleting for everyone...');
        }

        // Additional logic for actual deletion can be added here
        // For simplicity, we're just logging messages to the console.
    };

    function backClick() {
        setSelectedUserId(null);
    }
    function getMessageTimeDuration(updatedAt) {
        const updatedAtDate = new Date(updatedAt);
        const currentTime = new Date();
        const timeDifference = currentTime - updatedAtDate;
        const timeDifferenceInSeconds = Math.floor(timeDifference / 1000);
        const MINUTE = 60;
        const HOUR = 60 * MINUTE;
        const DAY = 24 * HOUR;

        if (timeDifferenceInSeconds < MINUTE) {
            return `${timeDifferenceInSeconds}s ago`;
        } else if (timeDifferenceInSeconds < HOUR) {
            const minutes = Math.floor(timeDifferenceInSeconds / MINUTE);
            return `${minutes}m ago`;
        } else if (timeDifferenceInSeconds < DAY) {
            const hours = Math.floor(timeDifferenceInSeconds / HOUR);
            return `${hours}h ago`;
        } else if (timeDifference >= DAY) {
            const days = Math.floor(timeDifferenceInSeconds / DAY);
            return `${days}d ago`;
        } else {
            return "0s ago";
        }
    }

    return (
        // <div className='md:h-screen h-screen flex w-screen'>
        //     <div className="bg-blue-200 w-1/3 flex flex-col justify-between">
        <div className='h-screen flex overflow-hidden'>
            {/* <div className={`bg-blue-200 lg:w-1/3 w-screen flex flex-col justify-between overflow-hidden`}> */}
            <div className={`bg-gray-800 text-white lg:w-1/3 w-screen flex flex-col justify-between overflow-hidden`}>
                <div className='flex-grow'>
                    <Logo />
                    {
                        Object.keys(onlinePeopleExclOurUser).filter((e) => e !== id).map(userId => (
                            <Contact
                                key={userId}
                                id={userId}
                                online={true}
                                username={onlinePeopleExclOurUser[userId]}
                                onClick={() => setSelectedUserId(userId)}
                                selected={userId === selectedUserId}
                            />

                        ))
                    }

                    {
                        Object.keys(offlinePeople).map(userId => (
                            <Contact
                                key={userId}
                                id={userId}
                                online={false}
                                username={offlinePeople[userId].username}
                                onClick={() => setSelectedUserId(userId)}
                                selected={userId === selectedUserId}
                            />
                        ))
                    }
                </div>
                <div className='flex flex-row items-center justify-center lg:p-2 pb-3'>
                    <div className='flex items-center gap-1 cursor-pointer mr-2 capitalize font-mono text-2xl font-bold'>


                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                        </div>
                        <div className='font-mono font-medium md:text-2xl text-xl pr-1 capitalize'>
                            {username}
                        </div>
                    </div>
                    <div onClick={logout} className='flex bg-green-500 items-center justify-center'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-black p-2 cursor-pointer">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25" />
                        </svg>
                        <button title='SignOut' className='text-md text-white md:text-xl font-medium lg:p-2'>Sign out &nbsp;</button>
                    </div>
                </div>
            </div>


            {/* <div className="flex flex-col bg-blue-400 md:w-2/3 ">
                <div className='flex-grow md:mx-2'> */}
            {/* <div className={`flex flex-col bg-blue-400 lg:w-2/3 (${!selectedUserId} ? hidden:w-full)`}> */}
            <div className={`${selectedUserId ? "bg-img bg-zinc-800 " : ""} flex flex-col lg:w-2/3`}>
                <div className=' flex-grow lg:mx-2'>
                    {/* <div className='flex h-full flex-grow items-center justify-center'> */}
                    {!selectedUserId && (
                        <div className='flex h-full bg-slate-800 pr-[25rem] flex-grow items-center justify-center w-screen max-md:hidden'>
                            <div className='text-white font-medium'>&larr; Select a person from sidebar</div>
                        </div>
                    )}


                    {!!selectedUserId && (
                        <div className='relative h-full max-md:w-screen overflow-x-hidden'>

                            <div className=' overflow-y-scroll absolute inset-0 ml-4 max-sm:pt-12 pr-5'>
                                {/* <div className='sm:hidden items-center flex justify-between z-50  bg-blue-800 fixed top-0 left-0 right-0 bottom-0 h-10'> */}
                                <div className='sm:hidden bg-green-400 pr-8 py-6 items-center flex justify-between z-50  fixed top-0 left-0 right-0 bottom-0 h-10'>
                                    <button onClick={backClick} className=" font-mono font-semibold text-white text-left pl-4 ">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>
                                    </button>
                                    <p className='font-mono font-semibold text-white pr-3 text-xl capitalize '>{recipientUsername}</p>
                                </div>

                                {messagesWithoutDupes.map(message => (
                                    <div key={message._id} className={(message.sender === id ? 'text-right' : 'text-left')}>
                                        <div className={"font-mono font-medium relative inline-block py-3  px-6 my-4 rounded-[2.2rem] text-[18px] cursor-text p-4 hover:bg-secondary order-1 rounded-br-none bg-primary " + (message.sender === id ? 'bg-green-700 max-w-[76%] text-white' : 'bg-gray-800 max-w-[76%] text-white mb-2')}
                                        >
                                            {message.text}
                                            <div className='h-[3px]'></div>
                                            <div>
                                                {
                                                    message.file && (
                                                        <div>
                                                            <a target="_blank" className='flex items-center justify-center text-[15px] font-medium pb-[2px] ' href={axios.defaults.baseURL + '/uploads/' + message.file}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                                                </svg> &nbsp;
                                                                {message.file}
                                                            </a>
                                                        </div>
                                                    )
                                                }
                                            </div>
                                            <div className='text-[10px] text-zinc-50 font-medium font-serif'>{getMessageTimeDuration(message.updatedAt)}</div>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesBoxRef}></div>
                            </div>
                        </div>
                    )}
                </div>


                {!!selectedUserId && (
                    <form onSubmit={sendMessage} className='flex flex-row items-center gap-2 mx-2 p-2 pb-2'>
                        <FreeSoloCreateOptionDialog />
                        <label className='relative cursor-pointer pb-4'>
                            <input type='file' className='hidden' onChange={sendFile} />
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
                            </svg>
                        </label>
                        <button type='submit' className='bg-green-800 p-3  text-white rounded-md mt-6'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 ">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                            </svg>
                        </button>

                    </form>

                )}

            </div>
        </div >

    )
}
