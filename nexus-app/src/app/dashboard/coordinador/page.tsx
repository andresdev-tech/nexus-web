'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '../../../lib/AuthContext';
import { useRouter } from 'next/navigation';
import { coordinadorAPI } from '../../../lib/api';
import { Users, BookOpen, ChevronRight } from 'lucide-react';

interface Programa {
  id: number;
  nombre: string;
  sector: string;
}

export default function CoordinadorPage() {
  const { usuario } = useAuth();
  const router = useRouter();
  const [programas, setProgramas] = useState<Programa[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (usuario && usuario.rol !== 'Coordinador' && usuario.rol !== 'Administrador') {
      router.push('/dashboard');
      return;
    }
    coordinadorAPI.misProgramas()
      .then(res => setProgramas(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [usuario]);

  if (loading) return (
    <div className="p-8 flex items-center justify-center min-h-64">
      <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-gradient-to-r from-[#0f2d6b] via-[#1a4ab5] to-[#2563eb] px-8 py-8 text-white">
        <div className="flex items-center gap-2 mb-1 text-blue-200 text-sm font-medium">
          <Users size={16} />
          Panel de Coordinación
        </div>
        <h1 className="text-3xl font-extrabold mb-1">Mis Grupos</h1>
        <p className="text-blue-100 text-sm">Gestiona la asistencia y matrículas de tus programas a cargo</p>
      </div>

      <div className="px-8 py-8 max-w-5xl">
        {programas.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <BookOpen size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400">No tienes programas asignados aún.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {programas.map((p) => (
              <button
                key={p.id}
                onClick={() => router.push(`/dashboard/coordinador/grupo/${p.id}`)}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-left hover:shadow-md hover:border-primary-200 transition-all group"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="bg-primary-50 p-2.5 rounded-xl group-hover:bg-primary-100 transition-colors">
                    <Users size={20} className="text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm leading-tight">{p.nombre}</h3>
                    <span className="text-xs text-gray-400">{p.sector}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm font-semibold text-primary-600 mt-2">
                  Ver grupo <ChevronRight size={14} />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}