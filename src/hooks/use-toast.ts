"use client"

import { useState, useCallback } from "react"

type ToastVariant = "default" | "destructive" | "success"

type Toast = {
  id: string
  title: string
  description?: string
  variant?: ToastVariant
  visible: boolean
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback(
    ({ title, description, variant = "default" }: { title: string; description?: string; variant?: ToastVariant }) => {
      const id = Math.random().toString(36).substring(2, 9)

      // Add the new toast
      setToasts((prevToasts) => [...prevToasts, { id, title, description, variant, visible: true }])

      // Auto-dismiss after 5 seconds
      setTimeout(() => {
        setToasts((prevToasts) => prevToasts.map((t) => (t.id === id ? { ...t, visible: false } : t)))

        // Remove from DOM after animation completes
        setTimeout(() => {
          setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id))
        }, 300)
      }, 5000)
    },
    [],
  )

  const dismissToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.map((t) => (t.id === id ? { ...t, visible: false } : t)))

    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id))
    }, 300)
  }, [])

  return { toast, toasts, dismissToast }
}
