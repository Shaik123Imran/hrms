import { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = 'md'
}) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        onClose?.();
      }
    }

    if (open) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  let widthClass = 'max-w-lg';

  if (size === 'sm') {
    widthClass = 'max-w-sm';
  }

  if (size === 'lg') {
    widthClass = 'max-w-2xl';
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

      <div
        className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm animate-in"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        className={`relative w-full ${widthClass} animate-in rounded-2xl bg-white shadow-lift`}
      >
        <div className="flex items-center justify-between border-b border-ink-100 px-6 py-4">

          <h3 className="text-base font-semibold text-ink-800">
            {title}
          </h3>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-ink-400 hover:bg-ink-50 hover:text-ink-700"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </button>

        </div>

        <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
          {children}
        </div>

        {footer && (
          <div className="flex justify-end gap-2 border-t border-ink-100 px-6 py-4">
            {footer}
          </div>
        )}

      </div>
    </div>
  );
}