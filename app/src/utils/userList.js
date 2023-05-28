let userList = [
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

const addUser = (user) => (userList = [...userList, user]);

const getUserList = (room) => userList.filter((user) => user.room === room);

const deleteUser = (id) => (userList = userList.filter((user) => user.id !== id));

module.exports = {
    getUserList,
    addUser,
    deleteUser,
};
