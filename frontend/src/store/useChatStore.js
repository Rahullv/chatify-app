import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [], // ⭐ ALWAYS keep as array
  activeTab: "chats",
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) === true,

  toggleSound: () => {
    const newValue = !get().isSoundEnabled;
    localStorage.setItem("isSoundEnabled", JSON.stringify(newValue));
    set({ isSoundEnabled: newValue });
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedUser: (selectedUser) => set({ selectedUser }),

  // 🟢 Get all contacts
  getAllContacts: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/contacts");
      set({
        allContacts: Array.isArray(res.data)
          ? res.data
          : res.data.contacts || [],
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch contacts");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  // 🟢 Get chat partners
  getMyChatPartners: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/chats");
      set({
        chats: Array.isArray(res.data) ? res.data : res.data.chats || [],
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch chats");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  // 🟢 Get messages (FIXED for array/object response)
  getMessagesByUserId: async (userId) => {
    if (!userId) return;

    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);

      // ⭐ CRITICAL FIX: handle both API formats
      const safeMessages = Array.isArray(res.data)
        ? res.data
        : res.data.messages || [];

      set({ messages: safeMessages });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch messages");
      set({ messages: [] }); // safety fallback
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  // 🟢 Send message (FULLY FIXED + Optimistic UI + No crash)
  sendMessage: async (messageData) => {
    const { selectedUser } = get();
    const { authUser } = useAuthStore.getState();

    if (!selectedUser?._id || !authUser?._id) return;

    const tempId = `temp-${Date.now()}`;

    const optimisticMessage = {
      _id: tempId,
      senderId: authUser._id,
      receiverId: selectedUser._id,
      text: messageData.text,
      image: messageData.image,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    };

    // ⭐ ALWAYS get latest safe messages
    const currentMessages = get().messages || [];

    // Optimistic UI update (instant message)
    set({
      messages: [...currentMessages, optimisticMessage],
    });

    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData,
      );

      const latestMessages = get().messages || [];

      // Replace optimistic message with real message
      set({
        messages: latestMessages.map((msg) =>
          msg._id === tempId ? res.data : msg,
        ),
      });
    } catch (error) {
      // Rollback optimistic message if failed
      const latestMessages = get().messages || [];
      set({
        messages: latestMessages.filter((msg) => msg._id !== tempId),
      });

      toast.error(error?.response?.data?.message || "Failed to send message");
    }
  },

  // 🟢 Real-time socket subscription (SAFE)
  subscribeToMessages: () => {
    const { selectedUser, isSoundEnabled } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.off("newMessage"); // prevent duplicate listeners

    socket.on("newMessage", (newMessage) => {
      const { authUser } = useAuthStore.getState();
      const { selectedUser } = get();

      // 🚨 MOST IMPORTANT FIX
      if (newMessage.senderId === authUser._id) return;

      const isFromCurrentChat =
        newMessage.senderId === selectedUser._id &&
        newMessage.receiverId === authUser._id;

      if (!isFromCurrentChat) return;

      const currentMessages = get().messages || [];

      const alreadyExists = currentMessages.some(
        (msg) => msg._id === newMessage._id,
      );

      if (alreadyExists) return;

      set({
        messages: [...currentMessages, newMessage],
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.off("newMessage");
  },
}));
