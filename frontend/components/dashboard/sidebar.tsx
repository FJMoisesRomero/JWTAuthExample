import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LayoutDashboard, Users, Settings, Menu } from "lucide-react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ className, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()

  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      color: "text-white",
      bgColor: "bg-indigo-600/90",
    },

  ]

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-zinc-950/25 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-indigo-600 shadow-xl transition-transform duration-300 ease-in-out lg:static lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}
      >
        <div className="flex h-14 items-center border-b border-indigo-500 px-4 lg:h-[60px]">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 font-semibold text-white"
          >
            <span className="text-xl">🚀</span>
            <span className="text-lg font-bold">Sistema de Autenticación</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto lg:hidden text-white hover:bg-indigo-700"
            onClick={onClose}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        <ScrollArea className="flex-1 py-2">
          <nav className="grid gap-1 px-2">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  pathname === route.href
                    ? route.bgColor
                    : "text-indigo-100 hover:bg-indigo-700",
                  pathname === route.href
                    ? route.color
                    : "text-indigo-100"
                )}
              >
                <route.icon className={cn("h-4 w-4", route.color)} />
                {route.label}
              </Link>
            ))}
          </nav>
        </ScrollArea>
      </div>
    </>
  )
}
