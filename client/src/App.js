import React from 'react';


import { BrowserRouter, Route, Routes } from "react-router-dom";


import VideoCall from './createRoom';
import Ui from './ui';

const App = () => {
    return (
        <div>
            {/* <NavBar /> */}
            <BrowserRouter>
                <Routes>
                    <Route path="/" exact element={<Ui />} />
                    <Route path="/ui" element={<VideoCall />} />

                </Routes>
            </BrowserRouter>


            {/* <Users />
            <About /> */}
        </div>
    );
}

export default App;
