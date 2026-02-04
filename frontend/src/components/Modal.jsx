export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-xl p-8 max-w-md w-[90%] shadow-2xl border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        {title && <h3 className="text-xl font-bold mb-6">{title}</h3>}
        {children}
      </div>
    </div>
  );
}
