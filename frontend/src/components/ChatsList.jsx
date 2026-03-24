import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import NoChatsFound from "./NoChatsFound";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";

// function ChatsList() {
//   const { chats, getMyChatPartners, setSelectedUser, isUsersLoading } = useChatStore();
//   const { onlineUsers } = useAuthStore();

//   useEffect(() => {
//     getMyChatPartners();
//   }, [getMyChatPartners]);

//   if (isUsersLoading) return <UsersLoadingSkeleton />;

//   if (!chats || chats.length === 0) {
//     return <NoChatsFound />;
//   }

//   return (
//     <>
//       {chats.map((user) => {
//         const isOnline = (onlineUsers || []).includes(user._id.toString());

//         return (
//           <div
//             key={user._id}
//             className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
//             onClick={() => setSelectedUser(user)}
//           >
//             <div className="flex items-center gap-3">
//               {/* 🟢 GREEN DOT FIX */}
//               <div className={`avatar ${isOnline ? "online" : "offline"}`}>
//                 <div className="size-12 rounded-full">
//                   <img src={user.profilePic || "/avatar.png"} alt={user.fullName} />
//                 </div>
//               </div>

//               <div>
//                 <h4 className="text-slate-200 font-medium">
//                   {user.fullName}
//                 </h4>
//                 <p className="text-xs text-slate-400">
//                   {isOnline ? "Online" : "Offline"}
//                 </p>
//               </div>
//             </div>
//           </div>
//         );
//       })}
//     </>
//   );
// }


function ChatsList() {
  const {
    chats,
    getMyChatPartners,
    setSelectedUser,
    isUsersLoading,
    selectedUser,
  } = useChatStore();

  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getMyChatPartners();
  }, [getMyChatPartners]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;
  if (!chats || chats.length === 0) return <NoChatsFound />;

  return (
    <>
      {chats.map((user) => {
        const isOnline = (onlineUsers || [])
          .map((id) => id.toString())
          .includes(user._id.toString());

        return (
          <div
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`p-4 rounded-lg cursor-pointer transition-colors
              ${
                selectedUser?._id === user._id
                  ? "bg-cyan-500/30"
                  : "bg-cyan-500/10 hover:bg-cyan-500/20"
              }`}
          >
            <div className="flex items-center gap-3">
              
              {/* Avatar */}
              <div className="relative">
                <img
                  src={user.profilePic || "/avatar.png"}
                  className="size-12 rounded-full object-cover"
                />
                {isOnline && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900"></span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <h4 className="text-slate-200 font-medium">
                  {user.fullName}
                </h4>

                <p className="text-xs text-slate-400 truncate">
                  {user.lastMessage || "Start conversation..."}
                </p>
              </div>

              {/* Unread count */}
              {user.unreadCount > 0 && (
                <span className="bg-cyan-500 text-xs px-2 py-1 rounded-full">
                  {user.unreadCount}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
}

export default ChatsList;