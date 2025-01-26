"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { AuthResponse, RegisterRequest } from "@/types/auth"
import { AuthLayout } from "@/components/auth-layout"
import { UserPlus } from "lucide-react"
import api from "@/lib/axios-config"

export default function Register() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [profileImageUrl, setProfileImageUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await api.post<AuthResponse>("/auth/register", {
        username,
        email,
        password,
        profileImageUrl
      } as RegisterRequest)

      console.log('API Response:', response.data)
      toast.success("¡Registro exitoso!")
      
      // Pequeño delay antes de redirigir para que se vea el toast
      setTimeout(() => {
        router.push("/login")
      }, 1000)
    } catch (error: any) {
      console.error('API Error:', error)
      toast.error(error.message || "Error al registrar usuario")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div className="text-center mb-8">
        <div className="inline-block p-3 rounded-full bg-primary/10 mb-3">
          <UserPlus className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-primary">Crear una cuenta</h2>
        <p className="text-sm text-muted-foreground">
          Ingresa tus datos para registrarte en el sistema
        </p>
      </div>

      <Card className="border-none shadow-none bg-transparent">
        <CardContent className="p-0">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="username">Nombre de usuario</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Usuario"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="correo@ejemplo.com"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="profileImageUrl">URL de imagen de perfil (opcional)</Label>
                <Input
                  id="profileImageUrl"
                  type="url"
                  value={profileImageUrl}
                  onChange={(e) => setProfileImageUrl(e.target.value)}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  disabled={isLoading}
                />
              </div>
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? "Creando cuenta..." : "Crear cuenta"}
              </Button>
              <div className="text-center text-sm">
                <span className="text-muted-foreground">¿Ya tienes una cuenta? </span>
                <Button 
                  variant="link" 
                  className="p-0 h-auto" 
                  onClick={() => router.push("/login")}
                  disabled={isLoading}
                >
                  Inicia sesión aquí
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </AuthLayout>
  )
}
