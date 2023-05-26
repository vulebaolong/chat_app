const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const Filter = require("bad-words");

// cài đặt static file
const publicPathDirectory = path.join(__dirname, "../public");
app.use(express.static(publicPathDirectory));
const server = http.createServer(app);
const io = socketio(server);
const { handleMes } = require("./utils/handleMes");

// lắng nghe sự kiện kết nối từ client
io.on("connection", (socket) => {
    console.log("connection");

    // gửi cho client vừa kết nối
    socket.emit("sendMesFromServer", handleMes("Chào mừng bạn đến với beautiful wold!"));

    // gửi cho các client còn lại
    socket.broadcast.emit("sendMesFromServer", handleMes("có một người mới tham gia"));

    socket.on("sendMesFromClient", (mes, cb) => {
        console.log(mes);
        const filter = new Filter();
        if (filter.isProfane(mes)) return cb("có từ khóa bẩn");
        io.emit("sendMesFromServer", handleMes(mes));
        cb();
    });

    // Chia sẻ vị trí
    socket.on("sendLocation", ({ latitude, longtitude }, cb) => {
        const urlLocation = `https://www.google.com/maps?q=${latitude},${longtitude}`;
        io.emit("sendLocation", handleMes(urlLocation));
        cb();
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
