import React from 'react';
import Notifications from './components/Notifications';
import Options from './components/Options';
import VideoPlayer from './components/VideoPlayer';

import { BrowserRouter, Route, Routes } from "react-router-dom";

import NavBar from './components/NavBar';
import About from './components/About';
import Users from './components/Users';
import VideoCall from './createRoom';
import Room from './room';

const App = () => {
    return (
        <div>
            {/* <NavBar /> */}
            <BrowserRouter>
                <Routes>
                    <Route path="/" exact element={<VideoCall />} />
                    {/* <Route path="/" element={<Room />} /> */}

                </Routes>
            </BrowserRouter>


            {/* <Users />
            <About /> */}
        </div>
    );
}

export default App;
