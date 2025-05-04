import { motion } from "framer-motion";
import ReactPlayer from "react-player";

export default function StreamModal({
  onClose,
  streamUrl,
  streamLoading,
}: {
  onClose: () => void;
  streamUrl: string | null;
  streamLoading: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2 bg-white border border-gray-200 rounded-xl shadow-lg p-2 flex flex-col items-center cursor-move"
      style={{ width: 350, maxWidth: "90vw" }}
      drag
      dragMomentum={false}
    >
      <div className="flex w-full justify-between items-center mb-2">
        <span className="text-gray-800 font-bold text-sm">
          Transmissão ao vivo
        </span>
        <button
          className="text-gray-400 hover:text-gray-700 text-lg font-bold px-2"
          onClick={onClose}
          title="Fechar"
        >
          ×
        </button>
      </div>
      {streamLoading ? (
        <div className="w-full aspect-video flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
      ) : streamUrl ? (
        <div className="w-full aspect-video rounded-lg overflow-hidden">
          <ReactPlayer
            url={streamUrl}
            width="100%"
            height="100%"
            controls
            playing
            muted={false}
          />
        </div>
      ) : (
        <div className="w-full aspect-video flex items-center justify-center text-gray-400">
          Sem transmissão ao vivo
        </div>
      )}
    </motion.div>
  );
}
