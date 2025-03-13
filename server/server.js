const http = require('http');
const handleRoutes = require('./routes');
const PORT = 3001;

const server = http.createServer(handleRoutes);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});