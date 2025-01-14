import React from 'react';


import { BrowserRouter, Route, Routes } from "react-router-dom";


import VideoCall from './createRoom';
import Ui from './ui';
import ChatInterface from './components/chatbox';
import LoginPage from './pages/login';

const App = () => {
    return (
        <div>
            {/* <NavBar /> */}
            <BrowserRouter>
                <Routes>
                    
                    <Route path="/" exact element={<LoginPage />} />
                    <Route path="/chat/:userId" element={< ChatInterface/>} />
                    <Route path="/ui" element={<Ui />} />

                </Routes>
            </BrowserRouter>


            {/* <Users />
            <About /> */}
        </div>
    );
}

export default App;
