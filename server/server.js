const http = require('http');
const db = require('./db');
const PORT = 3000;

const server = http.createServer(async (req, res) => {
    // ...
});

server.listen(PORT, () => {
    console.log(`Servering is running on port ${PORT}`);
});

