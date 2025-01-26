interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="min-h-screen flex">
      {/* Lado izquierdo - Imagen decorativa */}
      <div className="hidden lg:flex lg:w-1/2 bg-cover bg-center" style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1432821596592-e2c18b78144f?q=80&w=1470&auto=format&fit=crop')`
      }}>
        <div className="w-full h-full bg-black bg-opacity-50 flex items-center justify-center p-12">
          <div className="text-white">
            <h1 className="text-4xl font-bold mb-4">Sistema de Autenticación</h1>
            <p className="text-xl">Gestiona tu información de acceso de manera segura y eficiente</p>
          </div>
        </div>
      </div>

      {/* Lado derecho - Formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md px-6">
          {children}
        </div>
      </div>
    </main>
  );
}
