
import React, { useState, useRef, useEffect } from 'react';

import { io } from 'socket.io-client';
import Peer from 'simple-peer';



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
    const [rejectCall,setRejectCall]=useState(false)


    // console.log(callEndedByUser1,"callEndedByUser1")
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
            // setTimeout(() => {
            //     userNotAccepted()
            // }, 7000);
        });

        socket.current.on("allUsers", (users) => {
            setUsers(users);
        });
        socket.current.on("callEnded", ({ user }) => {

            setCallEnded(true)
            connectionRef.current.destroy();
            window.location.reload();
            console.log("The call has ended", user);
        });


        socket.current.on("callEnded", ({ user }) => {

            setCallEnded(true)
            connectionRef.current.destroy();
            window.location.reload();
            console.log("The call has ended", user);
        });

        socket.current.on("rejectCall", ({ user }) => {
            setRejectCall(true)
            // connectionRef.current.destroy();
            // window.location.reload();
            // setCallEnded(true)
            // connectionRef.current.destroy();
            // window.location.reload();
            console.log(user+" declined the call");
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
    console.log("Topppppppp",callAccepted)

    // const userNotAccepted=()=>{
    //     console.log(">>>>>>>>>>",callAccepted)

    //     if(callAccepted){
    //         console.log("call accepted",callAccepted)
    //     }else{
    //         console.log(" call not accepted")
    //     }
    // }

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

    const unMuteCall = () => {
        setCallMuted(false);
    }


const RejectCall=()=>{
    const data = { user: me, otherUser: call?.from };

    socket.current.emit("rejectCall", data);
    // window.location.reload();
// if(connectionRef.current){
    // connectionRef.current.destroy();
    setCall({isReceivingCall: false})

// }

}

console.log(call)
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
                                <button  className="accept-button" onClick={answerCall}>
                                    Accept Call
                                </button>
                                <button style={{backgroundColor:"red"}} onClick={RejectCall} className="accept-button" >
                                    Reject  Call
                                </button>

                            </div>
                        </div>
                    )}

                    {rejectCall&&
                    <div className="modal-overlay">
                            <div className="modal">
                                <span className="close-button" >
                                    &times;
                                </span>
                                {/* {call.name ? <h2>{call.name} is Calling</h2> : <h2>Incoming Call</h2>} */}
                                <h2>call rejected</h2>
                                <button style={{backgroundColor:"red"}} onClick={()=>setRejectCall(false)} className="accept-button" >
                                    ok
                                </button>

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
                                        src="https://i.postimg.cc/5NhwTTMw/istockphoto-1300845569-612x612-1.jpg"
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