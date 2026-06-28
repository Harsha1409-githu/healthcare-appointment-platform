import { motion } from "framer-motion";

const positions = {
  leftTop: "xl:-left-44 xl:top-24",
  rightMiddle: "xl:-right-44 xl:top-64",
  leftBottom: "xl:-left-44 xl:bottom-28",
  rightBottom: "xl:-right-44 xl:bottom-24",
};

export default function FloatingNotification({
  icon: Icon,
  title,
  text,
  position = "leftTop",
  delay = 0,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      animate={{ y: [0, -8, 0] }}
      transition={{
        opacity: { duration: 0.4, delay },
        y: {
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay,
        },
      }}
      viewport={{ once: true }}
      className={`absolute z-20 hidden xl:flex items-center gap-3 rounded-2xl border border-white/70 bg-white/90 px-4 py-3 shadow-2xl backdrop-blur-xl ${positions[position]}`}
    >
      <div className="grid h-9 w-9 place-items-center rounded-xl bg-cyan-50 text-cyan-600">
        <Icon size={17} />
      </div>

      <div>
        <p className="whitespace-nowrap text-xs font-black text-slate-950">
          {title}
        </p>
        <p className="whitespace-nowrap text-[11px] font-bold text-slate-500">
          {text}
        </p>
      </div>
    </motion.div>
  );
}