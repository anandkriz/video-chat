const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");

const io = require("socket.io")(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"]
	}
});

app.use(cors());

const PORT = 8000;

app.get('/', (req, res) => {
	res.send('Running');
});


const users = {};

const activeCalls = new Map();


io.on("connection", (socket) => {
	if (!users[socket.id]) {
		users[socket.id] = socket.id;
	}
	socket.emit("yourID", socket.id);
	socket.emit("me", socket.id);


	io.sockets.emit("allUsers", users);

	// socket.on("callEnded", ({user}) => {
	// 	io.emit("callEnded",{user})

	// 	// socket.broadcast.emit("callEnded",true)
	// 	delete users[user];
	// });

	socket.on("callEnded", (data) => {
		const { user, otherUser } = data;
		io.to(otherUser).emit("callEnded", { user });
		delete users[otherUser];

	});

	socket.on("rejectCall", (data) => {
		const { user, otherUser } = data;
		io.to(otherUser).emit("rejectCall", { user });
		delete users[otherUser];

	});


	socket.on("callUser", ({ userToCall, signalData, from, name }) => {
		io.to(userToCall).emit("callUser", { signal: signalData, from, name });
	});


	socket.on("answerCall", (data) => {
		io.to(data.to).emit("callAccepted", data.signal)
	});

	// socket.on("callEnded", ({user}) => {
	//     io.to(user).emit("callEnded",user ); // Broadcast a "callEnded" message to all connected clients
	// });

	// socket.on("callEnded", () => {
	// 	socket.broadcast.emit("callEnded"); // Broadcast a "callEnded" message to all connected clients except the sender
	// });
// sssss
});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));


