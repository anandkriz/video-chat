
import React, { useState, useRef, useEffect } from 'react';

import { io } from 'socket.io-client';
import Peer from 'simple-peer';



const VideoCall = () => {

    const [yourID, setYourID] = useState("");
    const [users, setUsers] = useState({});
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const [callMuted, setCallMuted] = useState(false);
    const [stream, setStream] = useState();
    const [name, setName] = useState('');
    const [call, setCall] = useState({});
    const [me, setMe] = useState('');
    const [idToCall, setIdToCall] = useState('');


    // console.log(callEndedByUser1,"callEndedByUser1")
    console.log(me, "meee")
    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();
    const socket = useRef();

    // console.log(users,"users")

    useEffect(() => {
        // socket.current = io.connect("https://video-chat-7w68.onrender.com");

        socket.current = io.connect("http://localhost:8000");

        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((currentStream) => {
                setStream(currentStream);
                myVideo.current.srcObject = currentStream;
            });

        socket.current.on('me', (id) => setMe(id));

        socket.current.on("yourID", (id) => {
            setYourID(id);
        });

        socket.current.on('callUser', ({ from, name: callerName, signal }) => {
            setCall({ isReceivingCall: true, from, name: callerName, signal });
        });

        socket.current.on("allUsers", (users) => {
            setUsers(users);
        });
        socket.current.on("callEnded", ({user}) => {

                setCallEnded(true)
                connectionRef.current.destroy();
                window.location.reload();
                console.log("The call has ended",   user);
        });

        return () => {
            socket.current.disconnect();
        };

    }, []);


    var ss = "ddd"

    const answerCall = () => {
        setCallAccepted(true);

        const peer = new Peer({ initiator: false, trickle: false, stream });

        peer.on('signal', (data) => {
            socket.current.emit('answerCall', { signal: data, to: call.from });
        });

        peer.on('stream', (currentStream) => {
            userVideo.current.srcObject = currentStream;
        });

        peer.signal(call.signal);

        connectionRef.current = peer;


    };


    const callUser = (id) => {

        const peer = new Peer({ initiator: true, trickle: false, stream });

        peer.on('signal', (data) => {
            socket.current.emit('callUser', { userToCall: id, signalData: data, from: me, name });
        });

        peer.on('stream', (currentStream) => {

            userVideo.current.srcObject = currentStream;
        });

        socket.current.on('callAccepted', (signal) => {
            setCallAccepted(true);
            peer.signal(signal);
        });

        connectionRef.current = peer;


    };





    const leaveCall = () => {
        setCallEnded(true);
        connectionRef.current.destroy();

        const otherUserId = call?.from ? call.from : idToCall;
        const data = { user: me, otherUser: otherUserId };
    
        socket.current.emit("callEnded", data);

        window.location.reload();
        // setUsers(users);

    };

    const muteCall = () => {
        setCallMuted(true);
    };

    console.log(call)
    const unMuteCall = () => {
        setCallMuted(false);
    }




    return (
        <>

            {/* <NavBar /> */}

            <div>
                <div className='options'>
                    <div className='option'>
                        <form noValidate autoComplete='off'>
                            <label>Set Your Name to be Displayed</label><br />
                            <input type='text' label='Name' value={name} onChange={(e) => setName(e.target.value)} />
                        </form>
                        <br />
                        <h3>Your ID: {me}</h3>
                        <p>Share this with your Friends so they can call you</p>
                    </div>
                    <div className='option'>
                        <form noValidate autoComplete='off'>
                            <label>Make A Call</label><br />
                            <input type='text' label='ID to call' value={idToCall} onChange={(e) => setIdToCall(e.target.value)} />
                        </form>
                        <br />
                        {
                            callAccepted && !callEnded ? (
                                <button onClick={leaveCall}>Hang Up</button>
                            ) : (
                                <button onClick={() => callUser(idToCall)}>Call</button>
                            )}
                    </div>
                </div>

                <>
                    {call.isReceivingCall && !callAccepted && (
                        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                            <h1>{call.name} is calling:</h1>
                            <button onClick={answerCall}>
                                Answer
                            </button>
                        </div>
                    )}
                </>
            </div>

            <div className='videos' id='video'>

                {stream && (
                    <div>
                        <div className='floatingName'>
                            <h3>{name || 'Name'}</h3>
                        </div>
                        <video playsInline muted ref={myVideo} autoPlay ></video>
                    </div>
                )
                }

                {
                    callAccepted && !callEnded &&
                    (
                        <div>
                            <div className='floatingName'>
                                <h3>{call.name || 'Name'}</h3>
                            </div>
                            <video playsInline muted={callMuted} autoPlay ref={userVideo} className='Video' > </video>
                            {
                                !callMuted ? (
                                    <button onClick={muteCall} > Mute </button>
                                ) : (
                                    <button onClick={unMuteCall} > Unmute </button>
                                )
                            }
                        </div>
                    )
                }
            </div>
            {/* <Options>
                <Notifications />
            </Options> */}
            {/* <VideoPlayer /> */}
            {/* <Users />
            <About /> */}




        </>
    );
}

export default VideoCall;


