import { axiosInstance } from "@/lib/axios"
import { Message, User } from "@/types"
import { create } from "zustand"
import { io } from "socket.io-client"

interface ChatStore {
    users: any[]
    fetchUsers: () => Promise<void>
    isLoading: boolean
    error: null | string
    socket: any
    isConnected: boolean
    onlineUsers: Set<string>
    userActivities: Map<string, string>
    messages: Message[]
    selectedUser: User | null

    initSocket: (userId: string) => void
    disconnectSocket: () => void
    sendMessage: (receiverId: string, senderId: string, content: string) => void
    fetchMessages: (userId: string) => Promise<void>;
    setSelectedUser: (user: User) => void
}

const baseURL = "https://spotify-backend-eye-970634887ce3.herokuapp.com"
const socket = io(baseURL, {
    autoConnect: false,
    withCredentials: true
})
export const useChatStore = create<ChatStore>((set, get) => ({
    users: [],
    isLoading: false,
    error: null,
    socket: socket,
    isConnected: false,
    onlineUsers: new Set(),
    userActivities: new Map(),
    messages: [],
    selectedUser: null,
    fetchUsers: async () => {
        set({ isLoading: true, error: null })
        try {
            const response = await axiosInstance.get('/users')
            set({ users: response.data })
        } catch (error: any) {
            set({ error: error.message })
        }
        finally {
            set({ isLoading: false })
        }
    },
    initSocket: (userId: string) => {
        if (!get().isConnected) {
            socket.auth = { userId }
            socket.connect()
            socket.emit("user_connected", userId)
            socket.on("users_online", (users: string[]) => {
                set({ onlineUsers: new Set(users) })
            })
            socket.on("activities", (activities: [string, string][]) => {
                set({ userActivities: new Map(activities) })
            })

            socket.on("user_connected", (userId: string) => {
                set((state) => ({
                    onlineUsers: new Set([...state.onlineUsers, userId])
                }))
            })

        
            socket.on("user_disconnected", (userId: string) => {
                set((state) => ({
                    onlineUsers: new Set([...state.onlineUsers].filter((id) => id !== userId)
                    )
                }))
            })

            socket.on("receive_message", (message: Message) => {
                set((state) => ({
                    messages: [...state.messages, message]
                }))
            })

            socket.on('message_sent', (message: Message) => {
                set((state) => ({
                    messages: [...state.messages, message]
                }))
            })

            socket.on("activities_updated", ({ userId, activity }) => {
                set((state) => {
                    const userActivities = new Map(state.userActivities)
                    userActivities.set(userId, activity)
                    return { userActivities }
                })
            })

            set({ isConnected: true })
        }
    },
    disconnectSocket: () => {
        if (get().isConnected) {
            socket.disconnect()
            set({ isConnected: false })
        }

    },
    sendMessage: async (receiverId: string, senderId: string, content: string) => {

        const socket = get().socket
        if (!socket) return

        socket.emit("send_message", { receiverId, senderId, content })
    },
    fetchMessages: async (userId: string) => {
        set({ isLoading: true, error: null })
        try {
            const response = await axiosInstance.get(`/users/messages/${userId}`)
            set({ messages: response.data })
        } catch (error: any) {
            set({ error: error.message })
        }
        finally {
            set({ isLoading: false })
        }
    },
    setSelectedUser: (user) => {
        set({ selectedUser: user })
    },

}))