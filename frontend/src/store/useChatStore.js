import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useChatStore  = create(()=>({
     allContacts: [],
     chats: [],
     messages: [],
     activeTab: [],
     selectedUser: [],
     isUserLoading: false,
     isMessagesLoading: false,
     isSoundEnabled: localStorage.getItem("isSoundEnabled") === true,


     toggleSound: () => {
          localStorage.setItem("isSoundEnabled", !get().isSoundEnabled);
          set({ isSoundEnabled: !get().isSoundEnabled});
     },

     setActivetab: (tab) => set({ activeTab: tab}),
     setSelectedUser: (selectedUser) => set({selectedUser}),

     getAllContacts: async () => {
          set({ isUserLoading: true});
          try {
               const res = await axiosInstance.get("/messages/contacts");
               set({ allContacts: res.data});
          } catch (error) {
               toast.error(error.response.data.message)
          } finally {
               set({isUserLoading: false});
          }
     },

     getMyChatPartners : async() => {
          set({ isUserLoading: true});
          try {
               const res = await axiosInstance.get("/messages/chats");
               set({ chats: res.data});
          } catch (error) {
               toast.error(error.response.data.message)
          } finally {
               set({isUserLoading: false});
          }
     }

}));

export default useChatStore;