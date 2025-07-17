import { cn } from "@/lib/utils"

interface ErrorMessageProps {
  content?: string
  className?: string
}

export function ErrorMessage({ content, className }: ErrorMessageProps) {
  if (!content) return null

  return (
    <div
      className={cn(
        "text-sm text-red-500 bg-red-50 border border-red-200 rounded-md px-3 py-2 mt-1",
        className
      )}
    >
      {content}
    </div>
  )
} 