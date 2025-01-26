import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, User } from "lucide-react"
import { toast } from "sonner"

interface HeaderProps {
  onSidebarOpen: () => void;
}

export function Header({ onSidebarOpen }: HeaderProps) {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("token")
    toast.success("¡Sesión cerrada correctamente!")
    router.push("/login")
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-indigo-500 dark:bg-indigo-500">
      <div className="container flex h-14 items-center lg:h-[60px]">
        <Button
          variant="ghost"
          size="icon"
          className="mr-2 lg:hidden text-white hover:bg-indigo-600"
          onClick={onSidebarOpen}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="hidden font-bold lg:inline-block text-white">
              Panel de Administración
            </span>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative h-8 w-8 rounded-full text-white hover:bg-indigo-600"
                >
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>


                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-red-600 focus:text-red-600"
                  onClick={handleLogout}
                >
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
