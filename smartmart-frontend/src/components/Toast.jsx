import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  X,
} from "lucide-react";

function Toast({
  message,
  type = "success",
  onClose,
}) {
  const config = {
    success: {
      icon: CheckCircle,
      wrapper: "bg-green-50 border-green-200",
      iconColor: "text-green-600",
      textColor: "text-green-800",
    },

    error: {
      icon: XCircle,
      wrapper: "bg-red-50 border-red-200",
      iconColor: "text-red-600",
      textColor: "text-red-800",
    },

    warning: {
      icon: AlertTriangle,
      wrapper: "bg-yellow-50 border-yellow-200",
      iconColor: "text-yellow-600",
      textColor: "text-yellow-800",
    },

    info: {
      icon: Info,
      wrapper: "bg-blue-50 border-blue-200",
      iconColor: "text-blue-600",
      textColor: "text-blue-800",
    },
  };

  const selected = config[type] || config.success;

  const Icon = selected.icon;

  return (
    <div
      className={`fixed top-5 right-5 z-[100]
      max-w-sm w-[calc(100%-2rem)]
      border rounded-xl shadow-lg
      px-4 py-3
      flex items-center gap-3
      ${selected.wrapper}`}
    >

      <Icon
        size={21}
        className={`shrink-0 ${selected.iconColor}`}
      />

      <p
        className={`text-sm font-medium flex-1 ${selected.textColor}`}
      >
        {message}
      </p>

      <button
        onClick={onClose}
        className="p-1 rounded-md hover:bg-black/5"
      >
        <X size={17} />
      </button>

    </div>
  );
}

export default Toast;