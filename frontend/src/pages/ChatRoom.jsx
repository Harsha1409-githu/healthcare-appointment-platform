import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Send,
  Stethoscope,
  UserRound,
  ShieldCheck,
  CheckCheck,
  Loader2,
  Paperclip,
} from "lucide-react";
import { io } from "socket.io-client";
import api from "../api/axios";

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const socket = io(SOCKET_URL, {
  transports: ["websocket"],
});

export default function ChatRoom() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const bottomRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const user =
    JSON.parse(localStorage.getItem("patientUser") || "null") ||
    JSON.parse(localStorage.getItem("doctorUser") || "null") ||
    JSON.parse(localStorage.getItem("user") || "null");

  const isDoctor = Boolean(user?.doctorName);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [appointment, setAppointment] = useState(null);
  const [typingUser, setTypingUser] = useState("");
  const [loading, setLoading] = useState(true);

  const currentUserName =
    user?.doctorName || user?.fullName || user?.email || "User";

  const receiver = useMemo(() => {
    if (isDoctor) {
      return {
        name: appointment?.patientName || appointment?.patient?.fullName || "Patient",
        subtitle: appointment?.patientPhone || appointment?.patient?.mobile || "Patient",
        image: appointment?.patient?.profileImage || "",
        icon: UserRound,
      };
    }

    return {
      name: appointment?.doctor?.doctorName || "Doctor",
      subtitle: appointment?.doctor?.specialization || "Specialist",
      image: appointment?.doctor?.profileImage || "",
      icon: Stethoscope,
    };
  }, [appointment, isDoctor]);

  useEffect(() => {
    loadInitialData();

    socket.emit("joinChatRoom", {
      appointmentId: Number(appointmentId),
    });

    socket.on("newChatMessage", (msg) => {
      setMessages((prev) => {
        const exists = prev.some((item) => item.id && item.id === msg.id);
        if (exists) return prev;
        return [...prev, msg];
      });
    });

    socket.on("userTyping", (data) => {
      if (data?.senderName && data.senderName !== currentUserName) {
        setTypingUser(data.senderName);

        clearTimeout(typingTimeoutRef.current);

        typingTimeoutRef.current = setTimeout(() => {
          setTypingUser("");
        }, 1600);
      }
    });

    return () => {
      socket.off("newChatMessage");
      socket.off("userTyping");
      clearTimeout(typingTimeoutRef.current);
    };
  }, [appointmentId, currentUserName]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, typingUser]);

  const loadInitialData = async () => {
    try {
      setLoading(true);

      const [appointmentRes, messagesRes] = await Promise.all([
        api.get(`/appointment/${appointmentId}`),
        api.get(`/chat/${appointmentId}`),
      ]);

      setAppointment(appointmentRes.data);
      setMessages(messagesRes.data || []);
    } catch (error) {
      console.error("Chat load error:", error);
      alert(error.response?.data?.message || "Failed to load chat");
    } finally {
      setLoading(false);
    }
  };

  const handleTyping = (value) => {
    setMessage(value);

    socket.emit("typing", {
      appointmentId: Number(appointmentId),
      senderName: currentUserName,
    });
  };

  const sendMessage = () => {
    const cleanMessage = message.trim();

    if (!cleanMessage || !user?.id) return;

    const tempMessage = {
      id: `temp-${Date.now()}`,
      appointmentId: Number(appointmentId),
      senderId: user.id,
      senderRole: isDoctor ? "DOCTOR" : "PATIENT",
      message: cleanMessage,
      createdAt: new Date().toISOString(),
      pending: true,
    };

    setMessages((prev) => [...prev, tempMessage]);

    socket.emit("sendChatMessage", {
      appointmentId: Number(appointmentId),
      senderId: user.id,
      senderRole: isDoctor ? "DOCTOR" : "PATIENT",
      message: cleanMessage,
    });

    setMessage("");
  };

  const formatMessageTime = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const shouldShowDate = (current, previous) => {
    if (!previous) return true;

    return (
      new Date(current.createdAt).toDateString() !==
      new Date(previous.createdAt).toDateString()
    );
  };

  const formatDateLabel = (date) => {
    const currentDate = new Date(date);
    const today = new Date();

    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (currentDate.toDateString() === today.toDateString()) return "Today";
    if (currentDate.toDateString() === yesterday.toDateString()) return "Yesterday";

    return currentDate.toLocaleDateString([], {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const ReceiverIcon = receiver.icon;

  if (loading) {
    return (
      <main className="h-screen bg-[#f4f8fb] flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 text-center">
          <Loader2 className="text-cyan-600 animate-spin mx-auto" size={34} />
          <p className="text-sm text-slate-500 font-bold mt-3">
            Opening secure chat...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="h-screen bg-[#eef8fc] flex flex-col overflow-hidden">
      <header className="shrink-0 bg-white/95 backdrop-blur-xl border-b border-slate-100 px-4 pt-3 pb-3">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center active:scale-95"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="relative shrink-0">
            {receiver.image ? (
              <img
                src={receiver.image}
                alt={receiver.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-cyan-100"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-cyan-50 border border-cyan-100 flex items-center justify-center">
                <ReceiverIcon className="text-cyan-600" size={24} />
              </div>
            )}

            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="text-base font-black text-slate-950 truncate">
              {receiver.name}
            </h1>

            <p className="text-xs text-emerald-600 font-black truncate">
              Online • {receiver.subtitle}
            </p>
          </div>

          <div className="w-9 h-9 rounded-2xl bg-emerald-50 flex items-center justify-center">
            <ShieldCheck size={18} className="text-emerald-600" />
          </div>
        </div>
      </header>

      <section className="flex-1 overflow-y-auto px-4 py-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white border border-slate-100 rounded-3xl p-4 text-center shadow-sm mb-5">
            {receiver.image ? (
              <img
                src={receiver.image}
                alt={receiver.name}
                className="w-20 h-20 rounded-full object-cover mx-auto border-2 border-cyan-100"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-cyan-50 flex items-center justify-center mx-auto">
                <ReceiverIcon className="text-cyan-600" size={36} />
              </div>
            )}

            <h2 className="text-lg font-black text-slate-950 mt-3">
              {receiver.name}
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              Appointment #{appointmentId}
            </p>

            <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-full bg-cyan-50 text-cyan-700 text-xs font-black">
              <ShieldCheck size={13} />
              Secure consultation chat
            </div>
          </div>

          {messages.length === 0 ? (
            <div className="text-center text-slate-400 py-10">
              <p className="font-bold text-sm">
                Start your conversation with {receiver.name}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {messages.map((msg, index) => {
                const mine = msg.senderId === user?.id;
                const previous = messages[index - 1];
                const showDate = shouldShowDate(msg, previous);

                return (
                  <div key={msg.id || index}>
                    {showDate && (
                      <div className="flex justify-center my-5">
                        <span className="px-3 py-1.5 rounded-full bg-white border border-slate-100 shadow-sm text-[11px] font-black text-slate-400">
                          {formatDateLabel(msg.createdAt)}
                        </span>
                      </div>
                    )}

                    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                      {!mine && (
                        <div className="w-7 h-7 rounded-full bg-cyan-50 border border-cyan-100 flex items-center justify-center mr-2 mt-auto overflow-hidden shrink-0">
                          {receiver.image ? (
                            <img
                              src={receiver.image}
                              alt={receiver.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ReceiverIcon className="text-cyan-600" size={15} />
                          )}
                        </div>
                      )}

                      <div
                        className={`max-w-[78%] px-4 py-2.5 rounded-[1.35rem] text-sm leading-relaxed shadow-sm ${
                          mine
                            ? "bg-cyan-600 text-white rounded-br-md"
                            : "bg-white text-slate-900 border border-slate-100 rounded-bl-md"
                        }`}
                      >
                        <p className="whitespace-pre-wrap break-words">
                          {msg.message}
                        </p>

                        <div
                          className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${
                            mine ? "text-cyan-50" : "text-slate-400"
                          }`}
                        >
                          <span>{formatMessageTime(msg.createdAt)}</span>
                          {mine && <CheckCheck size={13} />}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {typingUser && (
            <div className="flex justify-start mt-3">
              <div className="flex items-center gap-2 bg-white border border-slate-100 rounded-3xl px-4 py-3 shadow-sm">
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.15s]" />
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.3s]" />

                <span className="text-xs text-slate-500 font-bold ml-1">
                  typing...
                </span>
              </div>
            </div>
          )}

          <div ref={bottomRef} className="h-3" />
        </div>
      </section>

      <footer className="shrink-0 bg-white/95 backdrop-blur-xl border-t border-slate-100 px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+14px)]">
        <div className="max-w-md mx-auto">
          <div className="flex items-end gap-2 bg-slate-100 rounded-[2rem] p-2">
            <button
              type="button"
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-500 shrink-0"
            >
              <Paperclip size={20} />
            </button>

            <textarea
              rows="1"
              value={message}
              onChange={(e) => handleTyping(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Type a message..."
              className="flex-1 bg-transparent py-2.5 outline-none resize-none max-h-28 text-sm text-slate-900 placeholder:text-slate-400"
            />

            <button
              type="button"
              onClick={sendMessage}
              disabled={!message.trim()}
              className="w-10 h-10 rounded-full bg-cyan-600 text-white flex items-center justify-center disabled:bg-slate-300 active:scale-95 transition shadow-md shrink-0"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </footer>
    </main>
  );
}