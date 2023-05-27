const userList = [
    {
        id: 1,
        userName: "vũ lê bảo long",
        room: "123",
    },
    {
        id: 2,
        userName: "nhi nhi nhi",
        room: "123",
    },
    {
        id: 3,
        userName: "vy vy vy",
        room: "456",
    },
];

const getUserList = (room) => {
    return userList.filter((user) => user.room === room);
};

module.exports = {
    getUserList,
};
