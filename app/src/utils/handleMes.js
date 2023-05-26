const formatTime = require("date-format");

const handleMes = (mes) => {
    return {
        mes,
        createAt: formatTime("dd/MM/yyyy - hh:mm:ss", new Date()),
    };
};

module.exports = {
    handleMes,
};
