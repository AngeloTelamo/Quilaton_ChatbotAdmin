// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { ClientProvider } from './chatComponents/ClientContext'; // Import the ClientProvider
// import Register from "./pages/register";
// import Login from "./pages/login";
// import Home from './pages/home';


// const App = () => {
//   return (
//     <ClientProvider>
//       <Router>
//         <Routes>
//           <Route index element={<Login />} />
//           <Route path="/register" element={<Register />} />
//           <Route path='/home' element={<Home/>}/>
//         </Routes>
//       </Router>
      
//     </ClientProvider>
//   );
// };

// export default App;

import "./App.css";
import { BrowserRouter, Routes, Route }
    from "react-router-dom";
import SignIn from "./WebPage/SignIn";
import SignUp from "./WebPage/SignUp";
import ChatHome from "./WebPage/ChatHome";
 
function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route exact path="/"
                        element={<SignIn />} />
                    <Route path="/Signup"
                        element={<SignUp />} />
                    <Route path="/chat-home/:receiverId"
                        element={<ChatHome />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}
 
export default App;