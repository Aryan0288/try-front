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
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [typingUsers, setTypingUsers] = useState({});
    const [isTyping, setIsTyping] = useState(false);
    const typingTimeoutRef = useRef(null);

    const messagesBoxRef = useRef();
    const { username, id, setId, setUsername, newMessageText, setNewMessageText } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        connectToWs();
        console.log("this is ws 111 connector");
    }, [selectedUserId]) 

        function connectToWs() {
        // const ws = new WebSocket('ws://localhost:4000');
        const ws = new WebSocket('wss://try-backend-ouni.onrender.com');
        console.log("this is ws connector");

        setWs(ws);
        ws.addEventListener('message', handleMessage);
        ws.addEventListener('open', () => {
            console.log("WebSocket connected successfully");
        });
        ws.addEventListener('error', (error) => {
            console.log("WebSocket error:", error);
        });
        ws.addEventListener('close', () => {
            console.log("WebSocket closed, reconnecting...");
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
        console.log("people : ", people);
        setOnlinePeople(people);
    }


    function handleMessage(ev) {
        const messageData = JSON.parse(ev.data);
        console.log("messageData : ", messageData);
        
        if ('online' in messageData) {
            // console.log("messageData : ", messageData.online);
            ShowOnlinePeople(messageData.online);
        } else if ('text' in messageData) {
            if (messageData.sender === selectedUserId) {
                setMessages(prev => ([...prev, { ...messageData }]));
            }
        } else if ('typing' in messageData) {
            console.log("Typing event received:", messageData);
            // Handle typing indicator
            if (messageData.typing) {
                console.log("User is typing:", messageData.sender);
                setTypingUsers(prev => ({
                    ...prev,
                    [messageData.sender]: true
                }));
            } else {
                console.log("User stopped typing:", messageData.sender);
                setTypingUsers(prev => {
                    const newTypingUsers = { ...prev };
                    delete newTypingUsers[messageData.sender];
                    return newTypingUsers;
                });
            }
        }
    }

    function handleLogoutClick() {
        setShowLogoutModal(true);
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
            setShowLogoutModal(false);
        } catch (err) {
            console.log("error during logout ", err.message);
            return res.status(500).json({ status: false, message: err.message });
        }
    }

    function cancelLogout() {
        setShowLogoutModal(false);
    }

        // Handle typing indicator
    function handleTyping() {
        console.log("handleTyping called, selectedUserId:", selectedUserId, "isTyping:", isTyping);
        
        if (!isTyping && selectedUserId) {
            console.log("Sending typing event to:", selectedUserId);
            setIsTyping(true);
            
            // Send typing event to WebSocket
            if (ws && ws.readyState === WebSocket.OPEN) {
                const typingEvent = {
                    type: 'typing',
                    recipient: selectedUserId,
                    sender: id, // Add sender ID so recipient knows who is typing
                    typing: true
                };
                console.log("Sending typing event:", typingEvent);
                ws.send(JSON.stringify(typingEvent));
                console.log("Typing event sent successfully");
            } else {
                console.log("WebSocket not ready, state:", ws?.readyState);
            }
            
            // DON'T show current user as typing on their own screen
            // Only the recipient should see the typing indicator
        }

        // Clear existing timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Set new timeout to stop typing indicator
        typingTimeoutRef.current = setTimeout(() => {
            console.log("Typing timeout - stopping typing indicator");
            setIsTyping(false);
            if (selectedUserId && ws && ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({
                    type: 'typing',
                    recipient: selectedUserId,
                    sender: id, // Add sender ID
                    typing: false
                }));
                console.log("Stop typing event sent successfully");
            }
        }, 2000); // Stop typing indicator after 2 seconds of no typing
    }

    // Handle the send files
    async function sendMessage(ev, file = null) {
        if (ev) ev.preventDefault();
        // if (newMessageText && newMessageText.length > 100) {
        //     toast.error("Message is too long");
        //     return;
        // }
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

    // Clean up typing timeout when component unmounts or selectedUserId changes
    useEffect(() => {
        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, [selectedUserId]);




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
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [previousUserId, setPreviousUserId] = useState(null);
    
    useEffect(() => {
        if (selectedUserId) {
            // Add transition animation when switching users
            setIsTransitioning(true);
            setPreviousUserId(selectedUserId);
            
            // Simulate loading state
            setTimeout(() => {
                axios.get('/messages/' + selectedUserId).then(res => {
                    console.log("res.data : ", res.data); 
                    console.log("res res : ", res);
                    setMessages(res.data.data);
                    setRecipientUsername(res.data.info[0].username);
                    setIsTransitioning(false);
                });
            }, 300); // Small delay for smooth transition
        }
    }, [selectedUserId, setMessages]);

    const onlinePeopleExclOurUser = { ...onlinePeople };

    delete onlinePeopleExclOurUser[id];
    const messagesWithoutDupes = uniqBy(messages, '_id');

    // Enhanced user selection handler with animation
    const handleUserSelection = (userId) => {
        if (userId === selectedUserId) return; // Don't animate if same user
        
        // Add fade out effect
        setIsTransitioning(true);
        
        // Scroll to top smoothly when switching users
        const messagesContainer = document.querySelector('.messages-container');
        if (messagesContainer) {
            messagesContainer.scrollTo({ top: 0, behavior: 'smooth' });
        }
        
        // Small delay for smooth transition
        setTimeout(() => {
            setSelectedUserId(userId);
        }, 150);
    };


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
        <div className='h-screen flex overflow-hidden bg-[#f3f6fb]'>
            {/* Sidebar */}
            <div className={`bg-gradient-to-b from-[#1e3a8a] to-[#2563eb] text-white lg:w-1/3 w-screen flex flex-col justify-between overflow-hidden shadow-2xl`}>
                <div className='flex-grow'>
                    <Logo />
                    {
                        Object.keys(onlinePeopleExclOurUser).filter((e) => e !== id).map(userId => (
                            <Contact
                                key={userId}
                                id={userId}
                                online={true}
                                username={onlinePeopleExclOurUser[userId]}
                                onClick={() => handleUserSelection(userId)}
                                selected={userId === selectedUserId}
                                className={`user-card bg-white rounded-xl shadow-sm flex items-center gap-3 px-4 py-3 transition-all duration-300 hover:shadow-lg hover:border-blue-500 border border-transparent mb-2 text-gray-900 transform hover:scale-[1.02] ${
                                    userId === selectedUserId ? 'border-blue-500 shadow-lg scale-[1.02] bg-blue-50 selected animate-pulse-glow' : ''
                                }`}
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
                                onClick={() => handleUserSelection(userId)}
                                selected={userId === selectedUserId}
                                className={`user-card bg-white rounded-xl shadow-sm flex items-center gap-3 px-4 py-3 transition-all duration-300 hover:shadow-lg hover:border-blue-300 border border-transparent mb-2 text-gray-900 opacity-70 transform hover:scale-[1.02] ${
                                    userId === selectedUserId ? 'border-blue-300 shadow-lg scale-[1.02] bg-blue-50 opacity-100 selected animate-pulse-glow' : ''
                                }`}
                            />
                        ))
                    }
                </div>
                {/* User Profile Section */}
                <div className='bg-white rounded-t-2xl shadow-lg border-t border-blue-100 p-4'>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-3'>
                            <div className='w-10 h-10 bg-gradient-to-br from-[#2563eb] to-[#1e3a8a] rounded-full flex items-center justify-center'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#2563eb" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                </svg>
                            </div>
                            <div className='font-medium capitalize text-lg text-gray-900'>
                                {username}
                            </div>
                        </div>
                        <button 
                            onClick={handleLogoutClick} 
                            className='flex items-center gap-2 bg-red-500 hover:bg-red-600 transition-colors duration-200 px-4 py-2 rounded-lg shadow-lg hover:shadow-xl text-white font-medium'
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25" />
                            </svg>
                            <span className='font-medium'>Sign out</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Chat Area */}
            <div className={`${selectedUserId ? "bg-[#f3f6fb]" : ""} flex flex-col lg:w-2/3`}>
                <div className='flex-grow lg:mx-2'>
                    {!selectedUserId && (
                        <div className='flex h-full flex-grow items-center justify-center w-screen max-md:hidden pr-60'>
                            <div className='text-center'>
                                <div className='w-24 h-24 bg-gradient-to-br from-[#2563eb] to-[#1e3a8a] rounded-full flex items-center justify-center mx-auto mb-6'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-12 h-12">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                                    </svg>
                                </div>
                                <h3 className='text-2xl font-semibold text-gray-700 mb-2'>Welcome to DoChat</h3>
                                <p className='text-gray-500 font-medium'>&larr; Select a person from sidebar to start chatting</p>
                            </div>
                        </div>
                    )}

                    {!!selectedUserId && (
                        <div className='relative h-full max-md:w-screen overflow-x-hidden'>
                            {/* Mobile Header */}
                            <div className='sm:hidden bg-gradient-to-r from-[#2563eb] to-[#1e3a8a] pr-8 py-4 items-center flex justify-between z-50 fixed top-0 left-0 right-0 h-16 shadow-lg'>
                                <button onClick={backClick} className="font-semibold text-white text-left pl-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>
                                </button>
                                <p className='font-semibold text-white pr-3 text-xl capitalize'>{recipientUsername}</p>
                            </div>      

                            {/* Transition Overlay */}
                            {isTransitioning && (
                                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-40 transition-overlay">
                                    <div className="flex items-center space-x-3 animate-scale-in">
                                        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                        <span className="text-blue-600 font-medium">Loading conversation...</span>
                                    </div>
                                </div>
                            )}

                            {/* Messages Container */}
                            <div className={`messages-container overflow-y-scroll absolute inset-0 ml-4 max-sm:pt-20 pr-5 pb-20 transition-opacity duration-300 ${
                                isTransitioning ? 'opacity-50' : 'opacity-100'
                            }`}>
                                {messagesWithoutDupes.map((message, index) => (
                                    <div 
                                        key={message._id} 
                                        className={`${message.sender === id ? 'text-right animate-slide-in-right' : 'text-left animate-slide-in-left'} animate-fade-in`}
                                        style={{
                                            animationDelay: `${index * 50}ms`,
                                            animationFillMode: 'both'
                                        }}
                                    >
                                        <div className={`message-bubble font-medium relative inline-block py-4 px-6 my-3 rounded-3xl text-[15px] cursor-text transition-all duration-300 hover:shadow-xl transform hover:scale-[1.02] ${
                                            message.sender === id 
                                                ? 'bg-gradient-to-r from-[#2563eb] to-[#1e40af] text-white max-w-[75%] shadow-lg border border-blue-700/20' 
                                                : 'bg-white border border-blue-100 max-w-[75%] text-gray-800 mb-2 shadow-md hover:shadow-lg'
                                        }`}>
                                            <div className='leading-relaxed'>
                                                {message.text}
                                            </div>
                                            <div className='h-[2px]'></div>
                                            <div>
                                                {
                                                    message.file && (
                                                        <div className='mt-2'>
                                                            <a target="_blank" className='flex items-center justify-center text-[13px] font-medium py-1 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors duration-200' href={axios.defaults.baseURL + '/uploads/' + message.file}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                                                </svg>
                                                                {message.file}
                                                            </a>
                                                        </div>
                                                    )
                                                }
                                            </div>
                                            <div className={`text-[10px] font-medium mt-2 ${
                                                message.sender === id 
                                                    ? 'text-blue-100' 
                                                    : 'text-gray-400'
                                            }`}>
                                                {getMessageTimeDuration(message.updatedAt)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                
                                <div ref={messagesBoxRef}></div>   
                            </div>
                            {/* Fixed Typing Indicator - Always Visible at Bottom */}
                            {Object.keys(typingUsers).map(typingUserId => {
                                if (typingUserId === id) {
                                    return null;
                                }
                                let typingUsername = '';
                                if (typingUserId === selectedUserId) {
                                    typingUsername = recipientUsername;
                                } else {
                                    typingUsername = onlinePeople[typingUserId] || offlinePeople[typingUserId]?.username || 'Someone';
                                }
                                return (
                                    <div key={typingUserId} className='absolute bottom-1 left-4 right-4 z-10'>
                                        <div className='inline-block py-3 px-6 rounded-3xl bg-white border border-blue-100 max-w-[75%] shadow-lg'>
                                            <div className='flex items-center space-x-1'>
                                                <div className='flex space-x-1'>
                                                    <div className='w-2 h-2 bg-[#2563eb] rounded-full typing-dot'></div>
                                                    <div className='w-2 h-2 bg-[#2563eb] rounded-full typing-dot'></div>
                                                    <div className='w-2 h-2 bg-[#2563eb] rounded-full typing-dot'></div>
                                                </div>
                                                <span className='text-blue-500 text-sm ml-2 font-medium'>
                                                    {typingUsername} is typing...
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
                {/* Message Input */}
                {!!selectedUserId && (
                    <form onSubmit={sendMessage} className='flex flex-row items-center gap-3 mx-4 p-4 bg-white rounded-t-2xl shadow-lg border-t border-blue-100'>
                        <FreeSoloCreateOptionDialog onTyping={handleTyping} />
                        <label className='relative cursor-pointer p-2 hover:bg-blue-50 rounded-full transition-colors duration-200 pb-4'>
                            <input type='file' className='hidden' onChange={sendFile} />
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#2563eb" className="w-6 h-6 ">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
                            </svg>
                        </label>
                        <button type='submit' className='bg-gradient-to-r from-[#2563eb] to-[#1e40af] hover:from-[#1e40af] hover:to-[#2563eb] p-3 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                            </svg>
                        </button>
                    </form>
                )}
            </div>

            {/* Logout Confirmation Modal */}
            {showLogoutModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl transform transition-all">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#ef4444" className="w-8 h-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Sign Out</h3>
                            <p className="text-gray-600 mb-8">Are you sure you want to sign out? You'll need to log in again to continue chatting.</p>
                            
                            <div className="flex gap-4 justify-center">
                                <button
                                    onClick={cancelLogout}
                                    className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={logout}
                                    className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg"
                                >
                                    Yes, Sign Out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
