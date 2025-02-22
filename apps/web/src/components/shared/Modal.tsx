"use client";

import React, { useRef, useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  description?: string;
  icon?: React.ReactElement;
}

const Modal = ({
  isOpen,
  onClose,
  children,
  title,
  description,
  icon,
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isClosing, setIsClosing] = React.useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 200);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen && !isClosing) return null;

  return (
    <div
      className={`fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50 ${
        isClosing
          ? "animate-[modalFadeOut_0.2s_ease-out_forwards]"
          : "animate-[modalFadeIn_0.2s_ease-out]"
      }`}
    >
      <div
        ref={modalRef}
        className={`bg-[#0F1117] border border-white/[0.08] rounded-xl p-6 w-full max-w-md relative ${
          isClosing
            ? "animate-[modalSlideOut_0.2s_ease-out_forwards]"
            : "animate-[modalSlideIn_0.2s_ease-out]"
        }`}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white/80 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {(title || description || icon) && (
          <div className="flex items-center gap-3 mb-6">
            {icon && (
              <div className="w-10 h-10 rounded-lg bg-surface-hover flex items-center justify-center">
                {icon}
              </div>
            )}
            <div>
              {title && (
                <h3 className="text-lg font-semibold text-white">{title}</h3>
              )}
              {description && (
                <p className="text-sm text-gray-400">{description}</p>
              )}
            </div>
          </div>
        )}

        {children}
      </div>
    </div>
  );
};

export default Modal;
