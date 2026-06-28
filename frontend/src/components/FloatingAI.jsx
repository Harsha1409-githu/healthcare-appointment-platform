import { MessageCircleHeart } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function FloatingAI() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/ai-health-assistant")}
      className="
        fixed bottom-6 right-6 z-50
        bg-gradient-to-r from-cyan-600 to-blue-600
        text-white
        px-5 py-4
        rounded-full
        shadow-2xl
        flex items-center gap-3
        hover:scale-105
        transition-all duration-300
      "
    >
      <div className="relative">
        <MessageCircleHeart size={26} />

        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
      </div>

      <div className="hidden md:block text-left">
        <p className="font-black text-sm">
          Ask TryDoc AI
        </p>
      </div>
    </button>
  );
}