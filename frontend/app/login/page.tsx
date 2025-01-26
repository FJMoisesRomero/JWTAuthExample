"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { AuthResponse, LoginRequest } from "@/types/auth"
import { AuthLayout } from "@/components/auth-layout"
import { LockKeyhole } from "lucide-react"
import api from "@/lib/axios-config"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await api.post<AuthResponse>("/auth/login", {
        email,
        password,
      } as LoginRequest)

      console.log('API Response:', response.data)

      if (response.data.token) {
        localStorage.setItem("token", response.data.token)
        toast.success("¡Inicio de sesión exitoso!")
        
        // Pequeño delay antes de redirigir para que se vea el toast
        setTimeout(() => {
          router.push("/dashboard")
        }, 1000)
      } else {
        throw new Error("No se recibió el token de autenticación")
      }
    } catch (error: any) {
      console.error('API Error:', error)
      toast.error(error.message || "Error al iniciar sesión")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div className="text-center mb-8">
        <div className="inline-block p-3 rounded-full bg-primary/10 mb-3">
          <LockKeyhole className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-primary">¡Bienvenido de nuevo!</h2>
        <p className="text-sm text-muted-foreground">
          Ingresa tus credenciales para acceder a tu cuenta
        </p>
      </div>

      <Card className="border-none shadow-none bg-transparent">
        <CardContent className="p-0">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
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
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
              </Button>
              <div className="text-center text-sm">
                <span className="text-muted-foreground">¿No tienes una cuenta? </span>
                <Button 
                  variant="link" 
                  className="p-0 h-auto" 
                  onClick={() => router.push("/register")}
                  disabled={isLoading}
                >
                  Regístrate aquí
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </AuthLayout>
  )
}
