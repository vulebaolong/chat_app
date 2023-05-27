const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const Filter = require("bad-words");

const publicPathDirectory = path.join(__dirname, "../public");
const { handleMes } = require("./utils/handleMes");
const { getUserList } = require("./utils/userList");

// cài đặt static file
app.use(express.static(publicPathDirectory));
const server = http.createServer(app);
const io = socketio(server);

// lắng nghe sự kiện kết nối từ client
io.on("connection", (socket) => {
    console.log("connection");

    // room
    socket.on("createRoom", ({ room, username }) => {
        socket.join(room);

        // gửi lời chào cho client vừa kết nối
        socket.emit(
            "sendMesFromServer",
            handleMes("Chào mừng bạn đến với beautiful wold!")
        );

        // gửi cho các client còn lại
        socket.broadcast
            .to(room)
            .emit("sendMesFromServer", handleMes("có một người mới tham gia"));

        // chat
        socket.on("sendMesFromClient", (mes, cb) => {
            console.log(mes);
            const filter = new Filter();
            if (filter.isProfane(mes)) return cb("có từ khóa bẩn");
            io.to(room).emit("sendMesFromServer", handleMes(mes));
            cb();
        });

        // Chia sẻ vị trí
        socket.on("sendLocation", ({ latitude, longtitude }, cb) => {
            const urlLocation = `https://www.google.com/maps?q=${latitude},${longtitude}`;
            io.to(room).emit("sendLocation", handleMes(urlLocation));
            cb();
        });
        console.log(getUserList());
        // xử lý list user
        io.to(room).emit("userList", getUserList(room));
    });

    // lắng nghe sự kiện ngắt kết nối
    socket.on("disconnect", () => {
        console.log("client left server");
    });
});

// lắng nghe
const port = process.env.PORT || 3000;
server.listen(port, async () => {
    console.log(`Lắng nghe cổng http://localhost:${port} ...`);
});
