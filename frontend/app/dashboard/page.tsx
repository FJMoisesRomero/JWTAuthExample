"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Users, ArrowUpRight } from "lucide-react"
import { User } from "@/types/auth"
import { authService } from "@/services/api"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface DashboardCard {
  title: string
  value: string
  description: string
  icon: React.ElementType
  color: string
  bgColor: string
}

export default function Dashboard() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    loadUsers()
  }, [router])

  const loadUsers = async () => {
    try {
      const usersList = await authService.getUsers()
      setUsers(usersList)
    } catch (error) {
      console.error('Error loading users:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Obtener el último usuario registrado
  const getLastUser = () => {
    if (users.length === 0) return null
    return users.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0]
  }

  const lastUser = getLastUser()

  const cards: DashboardCard[] = [
    {
      title: "Usuarios Registrados",
      value: users.length.toString(),
      description: "Total de usuarios en el sistema",
      icon: Users,
      color: "text-indigo-500",
      bgColor: "bg-indigo-50",
    },
    {
      title: "Último Usuario",
      value: lastUser ? lastUser.username : "Sin usuarios",
      description: lastUser 
        ? `Registrado el ${new Date(lastUser.createdAt).toLocaleDateString()}`
        : "No hay usuarios registrados",
      icon: Activity,
      color: "text-indigo-500",
      bgColor: "bg-indigo-50",
    },
  ]

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Bienvenido al panel de administración
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
          {cards.map((card, index) => (
            <Card 
              key={index} 
              className="overflow-hidden transition-all duration-200 hover:shadow-lg"
            >
              <CardHeader className={`${card.bgColor}`}>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-900">
                    {card.title}
                  </CardTitle>
                  <card.icon className={`h-4 w-4 ${card.color}`} />
                </div>
                <div className="mt-4">
                  <div className="text-3xl font-bold text-gray-900">{card.value}</div>
                  <p className="text-xs text-gray-600 flex items-center mt-1">
                    <ArrowUpRight className="mr-1 h-4 w-4 text-emerald-500" />
                    {card.description}
                  </p>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Users Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {users.map((user) => (
            <Card 
              key={user.id} 
              className="overflow-hidden hover:shadow-lg transition-all duration-200"
            >
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={user.profileImageUrl || undefined} />
                    <AvatarFallback className="bg-indigo-100 text-indigo-600 text-lg">
                      {user.username.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">{user.username}</h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Miembro desde {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
