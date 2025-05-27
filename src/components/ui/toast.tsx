"use client"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

type ToastProps = {
  id: string
  title: string
  description?: string
  variant?: "default" | "destructive" | "success"
  visible: boolean
  onDismiss: (id: string) => void
}

export function Toast({ id, title, description, variant = "default", visible, onDismiss }: ToastProps) {
  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-50 w-full max-w-md transform rounded-lg shadow-lg transition-all duration-300 ease-in-out",
        visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
        variant === "destructive" ? "bg-red-600" : variant === "success" ? "bg-green-600" : "bg-slate-800",
      )}
    >
      <div className="flex items-start p-4">
        <div className="ml-3 w-0 flex-1 pt-0.5">
          <p className="text-sm font-medium text-white">{title}</p>
          {description && <p className="mt-1 text-sm text-white/80">{description}</p>}
        </div>
        <div className="ml-4 flex shrink-0">
          <button className="inline-flex text-white/80 hover:text-white" onClick={() => onDismiss(id)}>
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export function Toaster({
  toasts,
  onDismiss,
}: {
  toasts: Array<{
    id: string
    title: string
    description?: string
    variant?: "default" | "destructive" | "success"
    visible: boolean
  }>
  onDismiss: (id: string) => void
}) {
  if (!toasts.length) return null

  return (
    <>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          title={toast.title}
          description={toast.description}
          variant={toast.variant}
          visible={toast.visible}
          onDismiss={onDismiss}
        />
      ))}
    </>
  )
}
