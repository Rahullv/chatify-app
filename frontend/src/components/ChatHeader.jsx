// import { XIcon } from "lucide-react";
// import { useChatStore } from "../store/useChatStore";
// import { useEffect } from "react";
// import { useAuthStore } from "../store/useAuthStore";

// function ChatHeader() {
//   const { selectedUser, setSelectedUser } = useChatStore();
//   const { onlineUsers } = useAuthStore();
//   const isOnline = selectedUser ? onlineUsers.includes(selectedUser._id) : false;

//   useEffect(() => {
//     const handleEscKey = (event) => {
//       if (event.key === "Escape") setSelectedUser(null);
//     };

//     window.addEventListener("keydown", handleEscKey);

//     // cleanup function
//     return () => window.removeEventListener("keydown", handleEscKey);
//   }, [setSelectedUser]);

//   if (!selectedUser) {
//     return (
//       <div className="flex justify-center items-center bg-slate-800/50 border-b border-slate-700/50 max-h-[84px] px-6 flex-1">
//         <p className="text-slate-400">No user selected</p>
//       </div>
//     );
//   }

//   return (
//     <div
//       className="flex justify-between items-center bg-slate-800/50 border-b
//    border-slate-700/50 max-h-[84px] px-6 flex-1"
//     >
//       <div className="flex items-center space-x-3">
//         <div className={`avatar ${isOnline ? "online" : "offline"}`}>
//           <div className="w-12 rounded-full">
//             <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} />
//           </div>
//         </div>

//         <div>
//           <h3 className="text-slate-200 font-medium">{selectedUser.fullName}</h3>
//           <p className="text-slate-400 text-sm">{isOnline ? "Online" : "Offline"}</p>
//         </div>
//       </div>

//       <button onClick={() => setSelectedUser(null)}>
//         <XIcon className="w-5 h-5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer" />
//       </button>
//     </div>
//   );
// }
// export default ChatHeader;



import { XIcon } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";

function ChatHeader({ isTyping }) {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  // ✅ FIX: ensure string comparison (important)
  const isOnline = selectedUser
    ? (onlineUsers || [])
        .map((id) => id.toString())
        .includes(selectedUser._id.toString())
    : false;

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") setSelectedUser(null);
    };

    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [setSelectedUser]);

  if (!selectedUser) {
    return (
      <div className="flex justify-center items-center bg-slate-800/50 border-b border-slate-700/50 max-h-[84px] px-6 flex-1">
        <p className="text-slate-400">No user selected</p>
      </div>
    );
  }

  return (
    <div className="flex justify-between items-center bg-slate-800/50 border-b border-slate-700/50 max-h-[84px] px-6 flex-1">
      
      {/* LEFT SIDE */}
      <div className="flex items-center space-x-3">

        {/* Avatar with green dot */}
        <div className="relative">
          <img
            src={selectedUser.profilePic || "/avatar.png"}
            alt={selectedUser.fullName}
            className="w-12 h-12 rounded-full object-cover"
          />

          {/* 🟢 Green dot */}
          {isOnline && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900"></span>
          )}
        </div>

        {/* Name + Status */}
        <div>
          <h3 className="text-slate-200 font-medium">
            {selectedUser.fullName}
          </h3>

          <p className="text-sm">
            {isTyping ? (
              <span className="text-green-400 animate-pulse">
                Typing...
              </span>
            ) : isOnline ? (
              <span className="text-green-400">Online</span>
            ) : (
              <span className="text-slate-400">Offline</span>
            )}
          </p>
        </div>
      </div>

      {/* RIGHT SIDE (close button) */}
      <button onClick={() => setSelectedUser(null)}>
        <XIcon className="w-5 h-5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer" />
      </button>
    </div>
  );
}

export default ChatHeader;