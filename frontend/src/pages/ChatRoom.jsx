import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Send,
  Stethoscope,
  UserRound,
  MoreVertical,
  Smile,
  ShieldCheck,
  CheckCheck,
  Sparkles,
} from "lucide-react";
import { io } from "socket.io-client";
import api from "../api/axios";

const socket = io("http://localhost:3000");

export default function ChatRoom() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const bottomRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const user =
    JSON.parse(localStorage.getItem("patientUser") || "null") ||
    JSON.parse(localStorage.getItem("doctorUser") || "null") ||
    JSON.parse(localStorage.getItem("user") || "null");

  const isDoctor = !!user?.doctorName;

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [appointment, setAppointment] = useState(null);
  const [typingUser, setTypingUser] = useState("");

  const currentUserName =
    user?.doctorName || user?.fullName || user?.email || "User";

  const receiverName = isDoctor
    ? appointment?.patientName || "Patient"
    : appointment?.doctor?.doctorName || "Doctor";

  const receiverSubtitle = isDoctor
    ? appointment?.patientPhone || "Patient"
    : appointment?.doctor?.specialization || "Specialist";

  const receiverImage = isDoctor
    ? null
    : appointment?.doctor?.profileImage;

  useEffect(() => {
    loadAppointment();
    loadMessages();

    socket.emit("joinChatRoom", {
      appointmentId: Number(appointmentId),
    });

    socket.on("newChatMessage", (msg) => {
      setMessages((prev) => {
        const exists = prev.some((item) => item.id === msg.id);
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
        }, 1800);
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

  const loadAppointment = async () => {
    try {
      const res = await api.get(`/appointment/${appointmentId}`);
      setAppointment(res.data);
    } catch (error) {
      console.error("Appointment load error:", error);
    }
  };

  const loadMessages = async () => {
    try {
      const res = await api.get(`/chat/${appointmentId}`);
      setMessages(res.data || []);
    } catch (error) {
      console.error("Chat load error:", error);
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
    if (!message.trim() || !user?.id) return;

    socket.emit("sendChatMessage", {
      appointmentId: Number(appointmentId),
      senderId: user.id,
      senderRole: isDoctor ? "DOCTOR" : "PATIENT",
      message: message.trim(),
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
    const d = new Date(date);
    const today = new Date();

    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (d.toDateString() === today.toDateString()) return "Today";
    if (d.toDateString() === yesterday.toDateString()) return "Yesterday";

    return d.toLocaleDateString([], {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-950 flex items-center justify-center p-0 md:p-5 overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl" />

      <div className="relative w-full h-full md:max-w-6xl md:h-[94vh] bg-white/95 backdrop-blur-2xl md:rounded-[2.2rem] shadow-2xl overflow-hidden flex flex-col border border-white/20">
        <div className="h-20 px-4 md:px-6 bg-white/90 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-4 min-w-0">
            <button
              onClick={() => navigate(-1)}
              className="w-11 h-11 rounded-2xl hover:bg-slate-100 flex items-center justify-center transition"
            >
              <ArrowLeft size={22} />
            </button>

            <div className="relative shrink-0">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 via-cyan-500 to-emerald-400 p-[2px] shadow-lg">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                  {receiverImage ? (
                    <img
                      src={receiverImage}
                      alt={receiverName}
                      className="w-full h-full object-cover"
                    />
                  ) : isDoctor ? (
                    <UserRound className="text-blue-600" size={28} />
                  ) : (
                    <Stethoscope className="text-blue-600" size={28} />
                  )}
                </div>
              </div>

              <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-[3px] border-white rounded-full" />
            </div>

            <div className="min-w-0">
              <h1 className="font-black text-slate-900 truncate">
                {receiverName}
              </h1>

              <p className="text-xs text-emerald-600 font-black truncate">
                Online • {receiverSubtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-50 text-emerald-700 font-black text-sm">
              <ShieldCheck size={17} />
              Secure Chat
            </div>

            <button className="w-11 h-11 rounded-2xl hover:bg-slate-100 flex items-center justify-center transition">
              <MoreVertical size={22} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 md:px-10 py-7 bg-gradient-to-b from-slate-50 via-white to-blue-50/40">
          <div className="text-center mb-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 via-cyan-500 to-emerald-400 p-[3px] mx-auto shadow-xl">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                {receiverImage ? (
                  <img
                    src={receiverImage}
                    alt={receiverName}
                    className="w-full h-full object-cover"
                  />
                ) : isDoctor ? (
                  <UserRound className="text-blue-600" size={40} />
                ) : (
                  <Stethoscope className="text-blue-600" size={40} />
                )}
              </div>
            </div>

            <h2 className="font-black text-2xl text-slate-900 mt-4">
              {receiverName}
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Appointment #{appointmentId}
            </p>

            <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-black">
              <Sparkles size={16} />
              Secure MediCare consultation chat
            </div>
          </div>

          <div className="space-y-2">
            {messages.length === 0 && (
              <div className="text-center text-slate-400 py-10">
                Start the conversation with {receiverName}.
              </div>
            )}

            {messages.map((msg, index) => {
              const mine = msg.senderId === user?.id;
              const previous = messages[index - 1];
              const showDate = shouldShowDate(msg, previous);

              return (
                <div key={msg.id || index}>
                  {showDate && (
                    <div className="flex justify-center my-6">
                      <span className="px-4 py-2 rounded-full bg-white border border-slate-100 shadow-sm text-xs font-black text-slate-400">
                        {formatDateLabel(msg.createdAt)}
                      </span>
                    </div>
                  )}

                  <div
                    className={`flex ${
                      mine ? "justify-end" : "justify-start"
                    }`}
                  >
                    {!mine && (
                      <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mr-2 mt-auto overflow-hidden shrink-0">
                        {receiverImage ? (
                          <img
                            src={receiverImage}
                            alt={receiverName}
                            className="w-full h-full object-cover"
                          />
                        ) : isDoctor ? (
                          <UserRound
                            className="text-blue-600"
                            size={17}
                          />
                        ) : (
                          <Stethoscope
                            className="text-blue-600"
                            size={17}
                          />
                        )}
                      </div>
                    )}

                    <div
                      className={`max-w-[78%] md:max-w-[58%] px-4 py-3 rounded-[1.4rem] text-sm leading-relaxed shadow-sm ${
                        mine
                          ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-br-md"
                          : "bg-white text-slate-900 border border-slate-100 rounded-bl-md"
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words">
                        {msg.message}
                      </p>

                      <div
                        className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${
                          mine ? "text-blue-100" : "text-slate-400"
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

            {typingUser && (
              <div className="flex justify-start mt-3">
                <div className="flex items-center gap-2 bg-white border border-slate-100 rounded-[1.4rem] px-4 py-3 shadow-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.15s]" />
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.3s]" />
                  </div>

                  <span className="text-xs text-slate-500 font-bold">
                    {typingUser} is typing
                  </span>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-xl border-t border-slate-100 p-4">
          <div className="flex items-end gap-3 bg-slate-100 rounded-[2rem] p-2 shadow-inner">
            <button className="w-11 h-11 rounded-full hover:bg-white flex items-center justify-center text-slate-500 transition">
              <Smile size={22} />
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
              placeholder="Message..."
              className="flex-1 bg-transparent py-3 outline-none resize-none max-h-28 text-slate-900 placeholder:text-slate-400"
            />

            <button
              onClick={sendMessage}
              disabled={!message.trim()}
              className="w-11 h-11 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white flex items-center justify-center disabled:from-slate-300 disabled:to-slate-300 hover:scale-105 transition shadow-lg"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}