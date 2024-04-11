import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import { Button, Divider, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { useNavigate } from "react-router";
import Profile from './Profile.jpg';

import { firestore as db } from "../firebase";
import { auth } from "../firebase";

import {
    collection,
    onSnapshot,
    doc,
    addDoc,
    getDocs,
    getDoc
} from "firebase/firestore";

const UsersComponent = (props) => {
    const handleToggle = (username, userId, type, concern) => {
        props.handleToggle(username, userId, type, concern);
        props.setReceiverData({
            username: username,
            userId: userId,
            type: type,
        });
        props.navigate(`/chat-home/${userId}`);
    };

    return (
        <List
            dense
            sx={{
                width: "100%",
                maxWidth: 360,
                bgcolor: "background.paper"
            }}
        >
            {props.users?.map((value, index) => {
                const labelId = `checkbox-list-secondary-label-${value.userId}`;

                if (props.currentUserId !== value.userId) {
                    const clientName = value.name || "Unknown";
                    const concernMessage = value.concern || "No concern message";
                    return (
                        <ListItem key={value.userId} disablePadding>
                            <ListItemButton
                                onClick={() => {
                                    handleToggle(value.username, value.userId, value.type, concernMessage);
                                }}
                            >
                                <ListItemAvatar>
                                    <Avatar
                                        alt={clientName}
                                        src={`${value.username}.jpg`}
                                    />
                                </ListItemAvatar>
                                <ListItemText
                                    id={labelId}
                                    primary={<strong>{clientName}</strong>}
                                    secondary={concernMessage}
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                }
                return null;
            })}
        </List>
    );
};

export default function Home() {
    const [users, setUsers] = useState([]);
    const [receiverData, setReceiverData] = useState(null);
    const [chatMessage, setChatMessage] = useState("");
    const [allMessages, setAllMessages] = useState([]);
    const [concern, setConcern] = useState("");
    const [clientName, setClientName] = useState("");
    const [contactInfo, setContactInfo] = useState(""); // State to hold client's contact information

    const user = auth.currentUser;
    const navigate = useNavigate();

    useEffect(() => {
        const unsub1 = onSnapshot(collection(db, "admin_users"), (snapshot) => {
            setUsers(snapshot.docs.map((doc) => ({ ...doc.data(), type: "admin", userId: doc.id })));
        });

        const unsub2 = onSnapshot(collection(db, "clients"), (snapshot) => {
            setUsers(snapshot.docs.map((doc) => ({ ...doc.data(), type: "client", userId: doc.id })));
        });

        return () => {
            unsub1();
            unsub2();
        };
    }, []);

    useEffect(() => {
        const fetchClientInfo = async () => {
            if (receiverData && receiverData.type === "client") {
                const clientDocRef = doc(db, "clients", receiverData.userId);
                const clientDocSnapshot = await getDoc(clientDocRef);
    
                if (clientDocSnapshot.exists()) {
                    const clientData = clientDocSnapshot.data();
                    setClientName(clientData.name);
                    setContactInfo(clientData.contact);
    
                    // Fetch the messages collection under the client document
                    const messagesCollectionRef = collection(clientDocRef, "messages");
                    const messagesQuerySnapshot = await getDocs(messagesCollectionRef);
                    const messages = messagesQuerySnapshot.docs.map((doc) => doc.data());
    
                    // Set the messages state with the fetched messages
                    setAllMessages(messages);
                }
            } else {
                setClientName(""); // Reset client name if not available or receiverData type is not client
                setContactInfo(""); // Reset contact info if not available or receiverData type is not client
                setAllMessages([]); // Reset messages if receiverData type is not client
            }
        };
    
        fetchClientInfo();
    }, [receiverData]);
    
    

    const handleToggle = (username, userId, type, concern) => {
        setReceiverData({
            username: username,
            userId: userId,
            type: type,
        });
        setConcern(concern);
    };

    const sendMessage = async () => {
        try {
            if (user && receiverData) {
                const messageData = {
                    username: user.displayName,
                    messageUserId: user.uid,
                    message: chatMessage,
                    timestamp: new Date(),
                };
                
                const messageCollection = receiverData.type === "admin" ? "admin_users" : "clients";
                
                await addDoc(
                    collection(db, messageCollection, receiverData.userId, "messages"),
                    messageData
                );
                
                setAllMessages((prevMessages) => [...prevMessages, messageData]);
            } else {
                console.error("User is not authenticated, display name is not set, or receiver data is not available.");
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
        setChatMessage("");
    };

    const AvatarProfile = () => (
        <div
          style={{
            borderRadius: "50%",
            overflow: "hidden",
            width: 50,
            height: 50,
          }}
        >
          <img
            src={Profile}
            alt="Profile"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      );

      useEffect(() => {
        const fetchAllMessages = async () => {
            try {
                // Verify if receiverData is updated correctly
                console.log(receiverData);
    
                if (receiverData && receiverData.type === "client") {
                    // Verify if the correct user ID is being used
                    console.log(receiverData.userId);
    
                    const clientRef = doc(db, "clients", receiverData.userId);
    
                    // Verify if the clientRef is correct
                    console.log(clientRef.path);
    
                    const messagesSnapshot = await clientRef.collection("messages").get();
                    const messages = messagesSnapshot.docs.map((doc) => doc.data());
                    setAllMessages(messages);
                } else {
                    // Reset allMessages if no client is clicked or receiverData type is not client
                    setAllMessages([]);
                }
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };
    
        fetchAllMessages();
    }, [receiverData]);
    
    return (
        <div style={root}>
            <Paper style={left}>
                <div
                    style={{
                        display: "flex",
                        padding: 5,
                        justifyContent: "space-between",
                    }}
                >
                    
                  <AvatarProfile />
                    <h5>Quilaton Office Chatroom</h5>

                    <Button
                        color="secondary"
                        onClick={() => {
                            auth.signOut();
                            navigate("/");
                        }}
                    >
                        Logout
                    </Button>
                </div>
                <Divider />
                
                All Chat from Clients

                <div style={{ overflowY: "scroll" }}>
                    <UsersComponent
                        users={users}
                        setReceiverData={setReceiverData}
                        navigate={navigate}
                        currentUserId={user?.uid}
                        handleToggle={handleToggle}
                    />
                </div>
            </Paper>

            <Paper style={right}>
                <div>
                    <h4>{clientName}</h4>
                    <p>Contact: {contactInfo}</p>
                    <Divider />
                </div>
                
                <div style={messagesDiv}>
                    
                {concern && (
                        <div
                            key="concern"
                            style={{
                                margin: 2,
                                display: "flex",
                                flexDirection: "row",
                            }}
                        >
                            <span
                                style={{
                                    backgroundColor: "#BB8FCE",
                                    padding: 6,
                                    borderTopLeftRadius: 10,
                                    borderTopRightRadius: 10,
                                    borderBottomLeftRadius: 0,
                                    borderBottomRightRadius: 10,
                                    maxWidth: 400,
                                    fontSize: 15,
                                    textAlign: "left",
                                }}
                            >                          
                                {concern}
                            </span>
                        </div>
                    )}
                    
                    {allMessages.map(({ id, messageUserId, username, message }) => (
                        
                        <div
                            key={id}
                            style={{
                                margin: 2,
                                display: "flex",
                                flexDirection: user?.uid === messageUserId ? "row-reverse" : "row",
                            }}
                        >
                            <span
                                style={{
                                    backgroundColor: "#BB8FCE",
                                    padding: 6,
                                    borderTopLeftRadius: user?.uid === messageUserId ? 10 : 0,
                                    borderTopRightRadius: user?.uid === messageUserId ? 0 : 10,
                                    borderBottomLeftRadius: 10,
                                    borderBottomRightRadius: 10,
                                    maxWidth: 400,
                                    fontSize: 15,
                                    textAlign: user?.uid === messageUserId ? "right" : "left",
                                }}
                            >                          
                                {message}
                            </span>
                        </div>
                    ))}
                </div>
                <div style={{ width: "100%", display: "flex", flex: 0.08 }}>
                    <input
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        style={input}
                        type="text"
                        placeholder="Type message..."
                    />
                    <IconButton onClick={sendMessage}>
                        <SendIcon style={{ margin: 10 }} />
                    </IconButton>
                </div>
            </Paper>
        </div>
    );
}


const root = {
    display: "flex",
    flexDirection: "row",
    flex: 1,
    width: "100%",
};

const left = {
    display: "flex",
    flex: 0.2,
    height: "95vh",
    margin: 10,
    flexDirection: "column",
};

const right = {
    display: "flex",
    flex: 0.8,
    height: "95vh",
    margin: 10,
    flexDirection: "column",
};

const input = {
    flex: 1,
    outline: "none",
    borderRadius: 5,
    border: "none",
};

const messagesDiv = {
    backgroundColor: "#FBEEE6",
    padding: 5,
    display: "flex",
    flexDirection: "column",
    flex: 1,
    maxHeight: 460,
    overflowY: "scroll",
};
