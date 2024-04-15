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
    const handleToggle = (username, userId, type, concern) => { //Handle clicks to initiate a chat session
        props.handleToggle(username, userId, type, concern);
        props.setReceiverData({
            username: username,
            userId: userId,
            type: type,
        });
        props.navigate(`/chat-home/${userId}`); //render the client UID 
    };

    return (
        //list of users depends on whats store in firebase client collection
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

export default function Home() { //main component the chat room 
    const [users, setUsers] = useState([]);// State to hold client's contact information
    const [receiverData, setReceiverData] = useState(null); // State to hold client's contact information
    const [chatMessage, setChatMessage] = useState("");// State to hold client's contact information
    const [allMessages, setAllMessages] = useState([]);// State to hold client's contact information
    const [concern, setConcern] = useState("");// State to hold client's contact information
    const [clientName, setClientName] = useState("");// State to hold client's contact information
    const [createdTime, setCreatedTime] = useState(""); // State to hold client's contact information
    const [contactInfo, setContactInfo] = useState(""); // State to hold client's contact information

    const user = auth.currentUser;
    const navigate = useNavigate();


    useEffect(() => { //fetch method from firebase 
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

    // Fetch client information and messages when receiverData changes
    useEffect(() => {
        const fetchClientInfo = async () => {
            if (receiverData && receiverData.type === "client") { // Check if receiverData exists and its is "client" collection
                const clientDocRef = doc(db, "clients", receiverData.userId); //get the document based uid
                const clientDocSnapshot = await getDoc(clientDocRef); //get document function
    
                if (clientDocSnapshot.exists()) { //check if the document exists 
                    const clientData = clientDocSnapshot.data(); //if exisxt, extract the document data field
                    setClientName(clientData.name);
                    setContactInfo(clientData.contact);
    
                    const createdTime = clientData.createdTime.toDate(); //convert firestore timestamp
                    const formattedCreatedTime = createdTime.toLocaleString();//make readable string date 
                    setConcern(clientData.concern);
                    setCreatedTime(formattedCreatedTime);
                }
    
                const messagesCollectionRef = collection(clientDocRef, "messages"); //subcollection of client called messages
                const messagesQuerySnapshot = await getDocs(messagesCollectionRef); //fetch all document in subcollection
                const messages = messagesQuerySnapshot.docs.map((doc) => doc.data()); //render the data using map 
    
                setAllMessages(messages); //all messages
            } else {
                //set to null if the user doesnt exist in client collections
                setClientName("");
                setContactInfo("");
                setAllMessages([]);
            }
        };
    
        fetchClientInfo();
    }, [receiverData]);
    

    const handleToggle = (username, userId, type, concern) => {
        // Set the concern state with the provided concern
        setReceiverData({
            username: username,
            userId: userId,
            type: type,
        });
        // Set the concern state with the provided concern
            setConcern(concern);
        };

    const sendMessage = async () => {
        try {
            if (user && receiverData) {
                //check if the users/admin is authenticated and the receiverData is available
                const messageData = { 
                    //create docuemtn field for admin to write a replyMessages to client collection
                    username: user.displayName,
                    messageUserId: user.uid,
                    message: chatMessage,
                    timestamp: new Date(),
                };
                
                const messageCollection = receiverData.type === "admin" ? "admin_users" : "clients"; // Determine the collection to store the message based on the receiver's type
                
                await addDoc(
                    // Add the reply message to the Firestore collection under the clients collection
                    collection(db, messageCollection, receiverData.userId, "messages"),
                    messageData
                );
                 // Update the list of messages displayed on the UI including the reply messages and messages from client 
                setAllMessages((prevMessages) => [...prevMessages, messageData]);
            } else {
                 // Log an error if user authentication or receiverData is not available
                console.error("User is not authenticated, display name is not set, or receiver data is not available.");
            }
        } catch (error) {
             // Log an an error the messages experiencing an issues
            console.error("Error sending message:", error);
        }
         // Clear the chat message input field after sending the message
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
        //fetch all messages associated with client
        const fetchAllMessages = async () => {
            try {
                if (receiverData && receiverData.type === "client") { // Get a reference to the client document in the Firestore database
                    const clientRef = doc(db, "clients", receiverData.userId);
                    const messagesCollectionRef = collection(clientRef, "messages");
                    
                    // Retrieve all documents from the "messages" subcollection
                    const messagesQuerySnapshot = await getDocs(messagesCollectionRef);
                    const messages = messagesQuerySnapshot.docs.map((doc) => {
                        const messageData = doc.data();
                        // Convert Firestore Timestamp to JavaScript Date object
                        const timestamp = messageData.timestamp.toDate();
                        // Add timestamp to the message data
                        return { ...messageData, timestamp };
                    });

                     // Update the state variable to store all messages
                    setAllMessages(messages);
                } else {
                    // Reset allMessages if no client is clicked or receiverData type is not client
                    setAllMessages([]);
                }
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };
        // Call the fetchAllMessages function when the receiverData changes
        fetchAllMessages();
    }, [receiverData]);
    
    
    return (
        //main container for the initerface
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
                    {/* Chatroom title */}
                    <h5>Quilaton Office Chatroom</h5>

                    <Button
                    // Function to sign out user and navigate to home page
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
                 {/* Scrollable area for displaying users */}
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
                
                <div style={{ textAlign: "center" }}>
                    <h4>{clientName}</h4>
                    <p>Contact: {contactInfo}</p>
                    <Divider />
                </div>
                
                <div style={messagesDiv}>
                    {/* Display concern if available */}
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
                    {/* Display concern if available */}
                        <span
                            style={{
                                fontSize: 12,
                                color: "#666",
                                marginTop: 2, 
                                textAlign: "left",
                            }}
                        >
                            {createdTime}
                        </span>
                       
                     {/* Display messages reply with the client */}
                    {allMessages.map(({ id, messageUserId, username, message, timestamp }) => (
                       <div
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
                            <span
                                style={{
                                    fontSize: 12,
                                    color: "#666",
                                    marginTop: 2, 
                                    textAlign: 'right',
                                }}
                            >
                                 {/* Display timestamp of the message */}
                                {new Date(timestamp.seconds * 1000).toLocaleString()}
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
