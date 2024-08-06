const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const generateUUID = require("./utilities/uuidGenerate");
const chatService = require("./services/chat.service");
const userService = require("./services/user.service");
const config = require("./config/config.json");
const PORT = config.PORT || 4002;

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const usersInRoom = new Map();

io.on("connection", (socket) => {
  socket.on("registerUser", (data) => {
    socket.userId = data?.userId ?? null;
    console.log(`User registered: ${data?.userId}`);
  });

  socket.on("joinRoom", async (data) => {
    const { roomId, userId, senderId } = data;
    socket.join(roomId);

    if (!usersInRoom.has(roomId)) {
      usersInRoom.set(roomId, new Set());
    }
    usersInRoom.get(roomId).add(userId);

    io.to(roomId).emit("userConnected", { userId, status: "connected" });

    await userService.updateOne(
      { uid: senderId },
      { isOnline: true, lastSeen: new Date() }
    );

    console.log(`User ${senderId} joined room ${roomId}`);
  });

  socket.on("sendMessage", async (data) => {
    console.log(">>>>>log", data);
    const { roomId, senderId, message, file = null, receiverId } = data;
    const newMessage = {
      senderId,
      message,
      file,
      uid: generateUUID(),
      receiverId,
      roomId,
      repliedBySender: null,
      repliedByReceiver: null,
      senderInfo: null,
    };

    let senderInfo = await userService.userInfo(senderId);
    newMessage.senderInfo = senderInfo;

    io.to(roomId).emit("receiveMessage", newMessage);
    await chatService.update(roomId, newMessage);
  });

  socket.on("editMessage", async (data) => {
    console.log(">>>>>log", data);
    const { id, message, file = null, roomId, senderId, receiverId } = data;
    const updateData = {
      message,
      file,
      uid: id,
      roomId,
      senderId,
      receiverId,
      isEdited: true,
    };

    io.to(roomId).emit("updatedMessage", updateData);
    await chatService.updateMessage({ id, roomId }, updateData);
  });

  socket.on("deleteMessage", async (data) => {
    console.log(">>>>>deleteMessage", data);
    const { id, roomId, senderId, receiverId } = data;

    const getData = await chatService.getMessage({ id, roomId });
    console.log(">>getData", getData);

    const updateData = {
      message: "This message was deleted",
      uid: id,
      roomId,
      senderId,
      receiverId,
      file: null,
      fileType: null,
      deletedAt: Date.now(),
    };
    if (getData && getData.senderId == senderId) {
      io.to(roomId).emit("updatedMessage", updateData);
      await chatService.updateMessage({ id, roomId }, updateData);
    }
  });

  socket.on("replyMessage", async (data) => {
    const {
      id,
      roomId,
      senderId,
      receiverId,
      replyData,
      message,
      file = null,
    } = data;

    const newMessage = {
      senderId,
      message,
      file,
      uid: generateUUID(),
      receiverId,
      roomId,
    };

    const getData = await chatService.getMessage({ id, roomId });

    if (replyData.isGroup) {
      newMessage.repliedByMember = replyData;
      newMessage.repliedByReceiver = null;
      newMessage.repliedBySender = null;
    } else {
      if (getData && getData.senderId == senderId) {
        newMessage.repliedBySender = replyData;
        newMessage.repliedByReceiver = null;
      } else {
        newMessage.repliedByReceiver = replyData;
        newMessage.repliedBySender = null;
      }
    }

    console.log(">>newMessage", newMessage);
    io.to(roomId).emit("receiveMessage", newMessage);
    await chatService.update(roomId, newMessage);
  });

  socket.on("clearMessage", async (data) => {
    console.log(">>clearChat");
    const { roomId } = data;

    io.to(roomId).emit("clearChat");
    await chatService.clearMessage(data);
  });

  socket.on("disconnect", async (reason) => {
    console.log("Client disconnected", socket.userId);

    for (const [roomId, users] of usersInRoom.entries()) {
      if (users.has(socket.userId)) {
        users.delete(socket.userId);
        io.to(roomId).emit("userDisconnected", {
          userId: socket.userId,
          status: "disconnected",
        });

        await userService.updateOne(
          { uid: socket.userId },
          { isOnline: false, lastSeen: new Date() }
        );
        console.log(`User ${socket.userId} disconnected from room ${roomId}`);
        break;
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`socket io running at PORT: ${PORT}`);
});
