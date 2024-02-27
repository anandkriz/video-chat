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
                    <Route path="/" exact element={<VideoCall />} />
                    <Route path="/ui" element={<Ui />} />

                </Routes>
            </BrowserRouter>


            {/* <Users />
            <About /> */}
        </div>
    );
}

export default App;
