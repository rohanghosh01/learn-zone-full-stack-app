//lib/socket.ts

"use client";
import { io } from "socket.io-client";
import config from "../config/config.json";
const SOCKET_URL = config.SOCKET_BASE_URL;

const socket = io(SOCKET_URL, {});


// const disconnectSocket = () => {
//     console.log("Disconnecting socket...");
//     socket.disconnect();
//   }

export default socket;
