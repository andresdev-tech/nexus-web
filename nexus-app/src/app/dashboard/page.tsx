'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { programasAPI, inscripcionesAPI } from '../../lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  BookOpen, MessageSquare, ClipboardList, Users,
  ChevronRight, Sparkles, GraduationCap, BarChart2, Settings
} from 'lucide-react';

export default function DashboardPage() {
  const { usuario, loading, isAdmin, isAprendiz } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({ programas: 0, inscripciones: 0 });

  useEffect(() => {
    // Redirigir al panel admin si es administrador
    if (!loading && isAdmin()) {
      router.push('/dashboard/admin/overview');
      return;
    }
    const cargar = async () => {
      try {
        const [progRes, inscRes] = await Promise.all([
          programasAPI.listar(),
          isAprendiz() ? inscripcionesAPI.misInscripciones() : Promise.resolve({ data: [] }),
        ]);
        setStats({ programas: progRes.data.length, inscripciones: inscRes.data.length });
      } catch {}
    };
    if (!isAdmin()) cargar();
  }, [usuario]);

  const hora = new Date().getHours();
  const saludo = hora < 12 ? 'Buenos días' : hora < 18 ? 'Buenas tardes' : 'Buenas noches';

  return (
    <div className="bg-gray-50">

      {/* ── HERO BANNER ──────────────────────────────── */}
      <div className="bg-gradient-to-r from-[#0f2d6b] via-[#1a4ab5] to-[#2563eb] px-8 py-8 text-white">
        <div className="max-w-4xl">
          <div className="flex items-center gap-2 mb-3 text-blue-100 text-sm font-semibold">
            <Sparkles size={15} />
            Plataforma Académica Inteligente
          </div>
          <h1 className="text-3xl font-extrabold mb-2 leading-tight text-white drop-shadow-sm">
            {saludo},<br />
            <span className="text-white drop-shadow-md">{usuario?.nombres} {usuario?.apellidos}</span>
          </h1>
          <p className="text-blue-50 text-sm max-w-lg font-medium">
            {isAdmin()
              ? 'Gestiona usuarios, programas e inscripciones desde tu panel de administración.'
              : 'Explora los programas disponibles, gestiona tus inscripciones y consulta al ChatBot con IA.'}
          </p>

          {/* Badges de rol */}
          <div className="flex items-center gap-2 mt-3">
            <span className="bg-white/30 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 border border-white/40">
              <GraduationCap size={12} />
              {usuario?.rol}
            </span>
            <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full border border-white/30">
              {usuario?.correo_electronico}
            </span>
          </div>
        </div>
      </div>

      <div className="px-8 py-6 max-w-5xl space-y-6">

        {/* ── ESTADÍSTICAS ─────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: 'Programas',
              value: stats.programas,
              icon: BookOpen,
              color: 'text-blue-600',
              bg: 'bg-blue-50',
              show: true,
            },
            {
              label: 'Mis inscripciones',
              value: stats.inscripciones,
              icon: ClipboardList,
              color: 'text-green-600',
              bg: 'bg-green-50',
              show: isAprendiz(),
            },
            {
              label: 'Sectores',
              value: 7,
              icon: BarChart2,
              color: 'text-purple-600',
              bg: 'bg-purple-50',
              show: true,
            },
            {
              label: 'Modalidades',
              value: 3,
              icon: Sparkles,
              color: 'text-orange-600',
              bg: 'bg-orange-50',
              show: true,
            },
          ]
            .filter(s => s.show)
            .map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
                  <Icon size={18} className={color} />
                </div>
                <div className="text-3xl font-extrabold text-gray-900">{value}</div>
                <div className="text-gray-400 text-xs mt-0.5">{label}</div>
              </div>
            ))}
        </div>

        {/* ── ACCESOS RÁPIDOS ───────────────────────────── */}
        {isAprendiz() && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">¿Qué quieres hacer hoy?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  href: '/dashboard/programas',
                  icon: BookOpen,
                  gradient: 'from-blue-600 to-blue-400',
                  title: 'Explorar Programas',
                  desc: '20 programas disponibles en diferentes modalidades y horarios.',
                  cta: 'Ver programas',
                },
                {
                  href: '/dashboard/inscripciones',
                  icon: ClipboardList,
                  gradient: 'from-green-600 to-green-400',
                  title: 'Mis Inscripciones',
                  desc: 'Consulta el estado de tus inscripciones activas y pendientes.',
                  cta: 'Ver inscripciones',
                },
                {
                  href: '/dashboard/chatbot',
                  icon: MessageSquare,
                  gradient: 'from-purple-600 to-purple-400',
                  title: 'ChatBot con IA',
                  desc: 'Resuelve tus dudas sobre programas, requisitos e inscripciones.',
                  cta: 'Abrir ChatBot',
                },
              ].map(({ href, icon: Icon, gradient, title, desc, cta }) => (
                <Link key={href} href={href}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition-all group">
                  <div className={`bg-gradient-to-r ${gradient} p-5`}>
                    <div className="bg-white/20 w-10 h-10 rounded-xl flex items-center justify-center">
                      <Icon size={20} className="text-white" />
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-4">{desc}</p>
                    <div className="flex items-center gap-1 text-sm font-semibold text-primary-600 group-hover:gap-2 transition-all">
                      {cta} <ChevronRight size={15} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── PANEL ADMIN ───────────────────────────────── */}
        {isAdmin() && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Administración</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  href: '/dashboard/admin/usuarios',
                  icon: Users,
                  gradient: 'from-orange-500 to-orange-400',
                  title: 'Gestionar Usuarios',
                  desc: 'Ver, editar roles y administrar todos los usuarios registrados en la plataforma.',
                  cta: 'Ir a usuarios',
                },
                {
                  href: '/dashboard/admin/programas',
                  icon: Settings,
                  gradient: 'from-blue-600 to-blue-400',
                  title: 'Gestionar Programas',
                  desc: 'Crear, editar y desactivar programas de formación disponibles.',
                  cta: 'Ir a programas',
                },
              ].map(({ href, icon: Icon, gradient, title, desc, cta }) => (
                <Link key={href} href={href}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition-all group">
                  <div className={`bg-gradient-to-r ${gradient} p-5`}>
                    <div className="bg-white/20 w-10 h-10 rounded-xl flex items-center justify-center">
                      <Icon size={20} className="text-white" />
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-4">{desc}</p>
                    <div className="flex items-center gap-1 text-sm font-semibold text-primary-600 group-hover:gap-2 transition-all">
                      {cta} <ChevronRight size={15} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── BANNER IA ─────────────────────────────────── */}
        {isAprendiz() && (
          <div className="bg-gradient-to-r from-purple-700 to-purple-500 rounded-2xl p-6 flex items-center justify-between text-white">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-xl">
                <MessageSquare size={24} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg">¿Tienes alguna duda?</h3>
                <p className="text-purple-200 text-sm">
                  Nuestro ChatBot con IA responde tus preguntas al instante
                </p>
              </div>
            </div>
            <Link href="/dashboard/chatbot"
              className="flex-shrink-0 bg-white text-purple-700 font-bold px-5 py-2.5 rounded-xl hover:bg-purple-50 transition-colors flex items-center gap-2 text-sm">
              Consultar ahora
              <ChevronRight size={15} />
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}