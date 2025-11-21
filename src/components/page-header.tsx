import { cn } from "@/lib/utils"

type PageHeaderProps = {
  title: string
  description?: string
  className?: string
  children?: React.ReactNode
}

export function PageHeader({ title, description, className, children }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6", className)}>
      <div className="grid gap-1">
        <h1 className="text-2xl font-bold md:text-3xl font-headline tracking-tight">{title}</h1>
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </div>
  )
}
