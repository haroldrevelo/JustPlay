"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server");
const PORT = 3001;
server_1.app.listen(PORT, () => console.log(`🚀 Server ready at: http://localhost:${PORT}`));
