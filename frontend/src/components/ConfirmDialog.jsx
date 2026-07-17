import React, { useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";

export function ConfirmDialog({
  open,
  title,
  message,
  onCancel,
  onConfirm,
  confirmLabel,
  cancelLabel,
}) {
  const { t } = useLanguage();

  const handleBackdropClick = useCallback(() => {
    if (onCancel) onCancel();
  }, [onCancel]);

  const handleConfirm = useCallback(async () => {
    if (onConfirm) {
      await onConfirm();
    }
  }, [onConfirm]);

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleBackdropClick}
          />
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              role="dialog"
              aria-modal="true"
              className="w-full max-w-md overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="px-6 py-5">
                <h2 className="text-base font-semibold text-neutral-900">
                  {title || t("common.dialog.title")}
                </h2>
                <p className="mt-3 text-sm leading-6 text-neutral-600">
                  {message}
                </p>
              </div>
              <div className="flex items-center gap-3 border-t border-neutral-100 bg-neutral-50 px-4 py-4">
                <button
                  type="button"
                  onClick={onCancel}
                  className="flex-1 rounded-2xl border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-100"
                >
                  {cancelLabel || t("common.dialog.cancel")}
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="flex-1 rounded-2xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
                >
                  {confirmLabel || t("common.dialog.confirm")}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
