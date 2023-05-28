const socket = io();

const formMessage = document.querySelector("#form-message");
const inputMessage = document.querySelector("#input-message");
const btnShareLocation = document.querySelector("#btn_share-location");
const acknowledgements = (err) => {
    if (err) return console.log(err);
    console.log("gửi tin nhắn thành công");
    formMessage.reset();
};

formMessage.addEventListener("submit", (e) => {
    e.preventDefault();
    const mes = inputMessage.value;

    socket.emit("sendMesFromClient", mes, acknowledgements);
});

socket.on("sendMesFromServer", (mes) => {
    console.log({ ...mes });
});

// Chia sẻ vị trí
btnShareLocation.addEventListener("click", () => {
    if (!navigator.geolocation) {
        return alert("trình duyệt không hỗ trợ chia sẻ vị trí");
    }
    navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longtitude } = position.coords;
        socket.emit("sendLocation", { latitude, longtitude }, acknowledgements);
    });
});
socket.on("sendLocation", (urlLocation) => {
    console.log(urlLocation);
});

// khi submit form có attribute action="/chat.html"
const querySting = location.search;
const params = Qs.parse(querySting, {
    ignoreQueryPrefix: true,
});
const { room, username: userName } = params;
socket.emit("createRoom", { room, userName });

// xử lý userList
socket.on("userList", (userList) => {
    console.log(userList);
});

// xử lý thoát room
socket.on("exitRoom", (value) => {
    console.log(value);
});
