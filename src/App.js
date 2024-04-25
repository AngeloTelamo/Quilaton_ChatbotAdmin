// Import necessary components for routing from react-router-dom
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import components for different pages
import SignIn from "./WebPage/SignIn";
import SignUp from "./WebPage/SignUp";
import ChatHome from "./WebPage/ChatHome";
 
// Main component of the application
function App() {
    return (
        <div className="App">
            <BrowserRouter basename="/Quilaton_ChatbotAdmin">
                {/* Routes component to define routes */}
                <Routes>
                    <Route exact path="/" element={<SignIn />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/chat-home/:receiverId" element={<ChatHome />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}
export default App;
