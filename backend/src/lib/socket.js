const { Server } = require("socket.io")
const Messsage = require("../models/message.model")

const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:3000",
            credentials: true
        }
    })

    const userSocket = new Map() //{userId:SockertId}
    const userActivities = new Map() //{userId:activity}

    io.on("connection", (socket) => {
        socket.on("user_connected", (userId) => {
            userSocket.set(userId, socket.id)
            userActivities.set(userId, "online")

            //broadcast the user to all connected users that are online
            io.emit("user_connected", userId)
            io.emit("users_online", Array.from(userActivities.keys()))

            socket.emit("activities", Array.from(userActivities.entries()))
        })

        socket.on("update_activity", ({userId, activity}) => {
            userActivities.set(userId, activity)
            io.emit("activities_updated", { userId, activity })
        })

        socket.on("send_message", async (data) => {
            try {
                const { senderId, receiverId, content } = data
                const message = await Messsage.create({ senderId, receiverId, content })
                const receiverSocketId = userSocket.get(senderId)
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit("receive_message", message)
                }
                socket.emit("message_sent", message)
            } catch (error) {
                console.log(error)
                socket.emit("message_error", error.message)
            }
        })
        socket.on("disconnect", () => {
            let disconnectedUserId
            userSocket.forEach((socketId, userId) => {
                if (socketId === socket.id) {
                    disconnectedUserId = userId
                    userSocket.delete(userId)
                    userActivities.delete(userId)
                }
            })
            if (disconnectedUserId) {
                io.emit("user_disconnected", disconnectedUserId)
            }
        })
    })
}

module.exports = initializeSocket