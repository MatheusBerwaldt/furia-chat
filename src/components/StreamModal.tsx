"use client";
import { motion } from "framer-motion";
import ReactPlayer from "react-player";
import React, { useRef, useState, useEffect } from "react";

export default function StreamModal({
  onClose,
  streamUrl,
  streamLoading,
}: {
  onClose: () => void;
  streamUrl: string | null;
  streamLoading: boolean;
}) {
  // Posição inicial: canto superior direito
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const width = 350;
    const padding = 32; // 2rem (tailwind top-8/right-8)
    const x = window.innerWidth - width - padding;
    const y = padding;
    setPosition({ x, y });
  }, []);

  // Mouse drag
  function onMouseDown(e: React.MouseEvent) {
    setDragging(true);
    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
    document.body.style.userSelect = "none";
  }
  function onMouseMove(e: MouseEvent) {
    if (!dragging) return;
    setPosition({
      x: e.clientX - (dragStart.current?.x || 0),
      y: e.clientY - (dragStart.current?.y || 0),
    });
  }
  function onMouseUp() {
    setDragging(false);
    document.body.style.userSelect = "";
  }
  // Touch drag
  function onTouchStart(e: React.TouchEvent) {
    setDragging(true);
    const touch = e.touches[0];
    dragStart.current = {
      x: touch.clientX - position.x,
      y: touch.clientY - position.y,
    };
  }
  function onTouchMove(e: TouchEvent) {
    if (!dragging) return;
    const touch = e.touches[0];
    setPosition({
      x: touch.clientX - (dragStart.current?.x || 0),
      y: touch.clientY - (dragStart.current?.y || 0),
    });
  }
  function onTouchEnd() {
    setDragging(false);
  }
  useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
      window.addEventListener("touchmove", onTouchMove);
      window.addEventListener("touchend", onTouchEnd);
    } else {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    }
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [dragging]);

  return (
    <motion.div
      ref={modalRef}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      className="fixed z-50 bg-white border border-gray-200 rounded-xl shadow-lg p-2 flex flex-col items-center"
      style={{ width: 350, maxWidth: "90vw", left: position.x, top: position.y, cursor: dragging ? 'grabbing' : 'grab', userSelect: 'none' }}
    >
      <div
        className="flex w-full justify-between items-center mb-2 cursor-move select-none"
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      >
        <span className="text-gray-800 font-bold text-sm">Transmissão ao vivo</span>
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
