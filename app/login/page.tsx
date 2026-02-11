import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100 p-4 bg-[url('https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center">
      {/* Capa oscura para que se lea el texto sobre la imagen de fondo */}
      <div className="absolute inset-0 bg-blue-950/70 backdrop-blur-sm" />
      
      <div className="relative z-10 w-full max-w-md space-y-8">
        <div className="text-center text-white">
            <h1 className="text-4xl font-black tracking-tight drop-shadow-md">CAMPOREE 2026</h1>
            <p className="mt-2 text-blue-100">Plataforma Oficial de Evaluación</p>
        </div>
        
        <LoginForm />
        
        <p className="text-center text-xs text-blue-200/60">
            © 2026 Asociación de Clubes. Todos los derechos reservados.
        </p>
      </div>
    </div>
  )
}