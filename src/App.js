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
            <BrowserRouter>
                {/* Routes component to define routes */}
                <Routes>
                    <Route exact path="/" element={<SignIn />} />
                    <Route path="/Signup" element={<SignUp />} />
                    {/* Route for the Chat Home page with dynamic receiverId parameter */}
                    <Route path="/chat-home/:receiverId" element={<ChatHome />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}
export default App;
