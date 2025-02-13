
import React, { useState, useRef, useEffect } from 'react';

import { io } from 'socket.io-client';
import Peer from 'simple-peer';
import blank from './blank_image.webp'


const Ui = () => {

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
    const [showModal, setShowModal] = useState(false);
    const [rejectCall, setRejectCall] = useState({ status: false })
    const [startTime, setStartTime] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);

    // console.log(callEndedByUser1,"callEndedByUser1")
    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();
    const socket = useRef();
    const callAcceptedRef = useRef(null);
    const meRef = useRef(null)
    const userRef = useRef(null)
    // console.log(users,"users")

    useEffect(() => {
        socket.current = io.connect("https://video-chat-7w68.onrender.com");

        // socket.current = io.connect("http://localhost:8000");

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
            meRef.current = me
            userRef.current = from
            setTimeout(() => {
                userNotAccepted()
            }, 30000);
        });

        socket.current.on("allUsers", (users) => {
            setUsers(users);
        });
        socket.current.on("callEnded", ({ user }) => {
            console.log("The call has ended", user);

            setCallEnded(true)
            connectionRef.current.destroy();
            window.location.reload();
        });




        socket.current.on("rejectCall", ({ user }) => {
            setRejectCall({ status: true, msg: "call rejected" })
            // connectionRef.current.destroy();
            // window.location.reload();
            // setCallEnded(true)
            // connectionRef.current.destroy();
            // window.location.reload();
            console.log(user + " declined the call");
        });

        socket.current.on("userNotResponder", ({ user }) => {
            setRejectCall({ status: true, msg: "No answar" })
            // console.log(user+" declined the call");
        });

        return () => {
            socket.current.disconnect();
        };

    }, []);


    var ss = "ddd"

    const answerCall = () => {
        setCallAccepted(true);
        startCall()

        callAcceptedRef.current = true
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
    // console.log("Topppppppp", callAccepted)

    const userNotAccepted = () => {
        // console.log(">>>>>>>>>>", callAcceptedRef.current)

        if (callAcceptedRef.current) {
            console.log("call accepted", callAccepted)
        } else {
            // RejectCall()
            const data = { otherUser: userRef.current };

            socket.current.emit("userNotResponder", data);
            setCall({ isReceivingCall: false })

            // console.log(" call not accepted", "mee",      "djhdj", userRef,"hujh")
        }
    }

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
            startCall()
            peer.signal(signal);
        });

        connectionRef.current = peer;


    };




    const leaveCall = async () => {
        setCallEnded(true);
        const otherUserId = call?.from ? call.from : idToCall;
        const data = { user: me, otherUser: otherUserId };

        console.log(data)
        await socket.current.emit("callEnded", data);
        // connectionRef.current.destroy();



        window.location.reload();
        // setUsers(users);

    };

    const muteCall = () => {
        setCallMuted(true);
    };

    const unMuteCall = () => {
        setCallMuted(false);
    }


    const RejectCall = () => {

        const data = { user: me, otherUser: call?.from };

        socket.current.emit("rejectCall", data);
        // window.location.reload();
        // if(connectionRef.current){
        // connectionRef.current.destroy();
        setCall({ isReceivingCall: false })

        // }

    }

    // console.log(call)

    const CallAgain = (id) => {
        setRejectCall({ status: false })
        callUser(id)

    }




    useEffect(() => {
        if (startTime !== null) {
            const intervalId = setInterval(() => {
                setElapsedTime(Date.now() - startTime);
            }, 1000);
            return () => clearInterval(intervalId);
        }
    }, [startTime]);

    const startCall = () => {
        setStartTime(Date.now());
    };

    const formatTime = (time) => {
        const seconds = Math.floor((time / 1000) % 60);
        const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
        const minutes = Math.floor((time / (1000 * 60)) % 60);
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

        const hours = Math.floor((time / (1000 * 60 * 60)) % 24);


        return hours === 0 ? `${formattedMinutes}:${formattedSeconds}` : `${hours}:${formattedMinutes}:${formattedSeconds}`;
    };





    return (
        <>

            {/* <NavBar /> */}

            {/* <div>
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
            </div> */}
            {/* <Options>
                <Notifications />
            </Options> */}
            {/* <VideoPlayer /> */}
            {/* <Users />
            <About /> */}



            <div className="header" style={{ padding: "30px" }}>



                <div>
                    {/* <button onClick={toggleModal}>Open Modal</button> */}

                    {call?.isReceivingCall && !callAccepted && (
                        <div className="modal-overlay">
                            <div className="modal">
                                <span className="close-button" >
                                    &times;
                                </span>
                                {call.name ? <h2>{call.name} is Calling</h2> : <h2>Incoming Call</h2>}
                                <div className="calling-animation">{true && <CallingAnimation />}</div>
                                <button className="accept-button" onClick={answerCall}>
                                    Accept Call
                                </button>
                                <button style={{ backgroundColor: "red" }} onClick={RejectCall} className="accept-button" >
                                    Reject  Call
                                </button>

                            </div>
                        </div>
                    )}

                    {rejectCall?.status &&
                        <div className="modal-overlay">
                            <div className="modal">
                                <span className="close-button" >
                                    &times;
                                </span>
                                {/* {call.name ? <h2>{call.name} is Calling</h2> : <h2>Incoming Call</h2>} */}
                                <h2>{rejectCall?.msg}</h2>
                                <div>
                                    <button style={{ backgroundColor: "red" }} onClick={() => setRejectCall(false)} className="accept-button" >
                                        ok
                                    </button>

                                    <button style={{ backgroundColor: "green" }} onClick={() => CallAgain(idToCall)} className="accept-button" >
                                        call again
                                    </button>

                                </div>


                            </div>
                        </div>}
                </div>

                <div className="container">

                    <div className="row">
                        <div className="col-1">

                            {
                                callAccepted && !callEnded ?
                                    (
                                        <>

                                            <video playsInline muted={callMuted} autoPlay ref={userVideo} className='host-video' > </video>

                                        </>
                                    ) : <img
                                        src={blank}
                                        className="host-img"
                                    />
                            }







                            <div className="contarols">
                                {
                                    callAccepted && !callEnded && <>
                                        <img src="https://i.postimg.cc/3NVtVtgf/chat.png" />
                                        <img src="https://i.postimg.cc/BQPYHG0r/disconnect.png" />
                                        <img
                                            src="https://i.postimg.cc/fyJH8G00/call.png"
                                            className="call-icon"
                                            onClick={leaveCall}
                                        />
                                        {
                                            !callMuted ? (

                                                <img onClick={muteCall} src="https://i.postimg.cc/bJFgSmFY/mic.png" />

                                            ) : (

                                                <img style={{ borderRadius: "50px" }} src="https://i.postimg.cc/KcBRv1P6/mute.jpg" onClick={unMuteCall} />
                                            )
                                        }
                                        <img src="https://i.postimg.cc/Y2sDvCJN/cast.png" />

                                    </>
                                }

                            </div>
                        </div>
                        <div className="col-2">
                            <div className="joined">
                                {/* <p>People Joined</p> */}

                                <div>
                                    {/* <img src="https://i.postimg.cc/WzFnG0QG/people-1.png" /> */}
                                    {stream && (
                                        <video playsInline muted ref={myVideo} autoPlay ></video>
                                        // <div>
                                        //     <div className='floatingName'>
                                        //         <h3>{name || 'Name'}</h3>
                                        //     </div>
                                        //     <video playsInline muted ref={myVideo} autoPlay ></video>
                                        // </div>
                                    )
                                    }

                                </div>
                                <div>
                                    {/* <button onClick={startCall}>Start Call</button> */}
                                    {elapsedTime > 0 && <h3> {formatTime(elapsedTime)}</h3>}

                                </div>
                            </div>
                            <div className="invite">
                                <h3>Your ID: {me}</h3>

                                <p> Enter Name</p>
                                <div>
                                    <input type='text' value={name} onChange={(e) => setName(e.target.value)}></input>
                                </div>
                                <p> Enter Id</p>
                                <div>
                                    <input type='text' value={idToCall} onChange={(e) => setIdToCall(e.target.value)} ></input>
                                </div>
                                {
                                    callAccepted && !callEnded ? (
                                        <button class="call-button" style={{ backgroundColor: "#ff0000" }} onClick={leaveCall}>Hang Up</button>
                                    ) : (
                                        <button class="call-button" onClick={() => callUser(idToCall)}>Call</button>
                                    )}

                                {/* {
                                    !callAccepted && callEnded && (
                                        <button class="call-button" onClick={() => callUser(idToCall)}>Call</button>

                                    )} */}


                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Ui;


const CallingAnimation = () => {
    return (
        <div className="calling-dots">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>

        </div>
    );
};