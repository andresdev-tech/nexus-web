'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authAPI } from '../../lib/api';

type Step = 'correo' | 'codigo' | 'nueva';

export default function RecuperarPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('correo');
  const [correo, setCorreo] = useState('');
  const [codigo, setCodigo] = useState('');
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [codigoDev, setCodigoDev] = useState(''); // Solo en desarrollo

  // PASO 1 — Solicitar código
  const handleSolicitarCodigo = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMensaje('');
    try {
      const res = await authAPI.recuperarPassword({ correo_electronico: correo });
      // Si el correo no está configurado, el backend devuelve el código directo
      if (res.data.codigo_dev) {
        setCodigoDev(res.data.codigo_dev);
        setMensaje(`Modo desarrollo: tu código es ${res.data.codigo_dev}`);
      } else {
        setMensaje(`Código enviado a ${correo}. Revisa tu bandeja de entrada y spam.`);
      }
      setStep('codigo');
    } catch {
      setError('Error al solicitar recuperación. Verifica el correo.');
    } finally {
      setLoading(false);
    }
  };

  // PASO 2 — Validar código contra el backend
  const handleValidarCodigo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (codigo.trim().length !== 6) {
      return setError('El código debe tener exactamente 6 dígitos.');
    }
    setLoading(true);
    setError('');
    try {
      // Verificamos el código enviando una contraseña temporal
      // Si el código es válido, avanzamos al paso 3
      await authAPI.verificarCodigo({
        correo_electronico: correo,
        codigo: codigo.trim(),
      });
      setStep('nueva');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Código inválido o expirado. Solicita uno nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // PASO 3 — Restablecer contraseña
  const handleRestablecerPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nuevaPassword !== confirmar) {
      return setError('Las contraseñas no coinciden.');
    }
    if (nuevaPassword.length < 6) {
      return setError('La contraseña debe tener al menos 6 caracteres.');
    }
    setLoading(true);
    setError('');
    try {
      await authAPI.restablecerPassword({
        correo_electronico: correo,
        codigo: codigo.trim(),
        nueva_password: nuevaPassword,
      });
      router.push('/login?reset=true');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al restablecer. Intenta solicitar un nuevo código.');
    } finally {
      setLoading(false);
    }
  };

  const stepIndex = ['correo', 'codigo', 'nueva'].indexOf(step);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-900 to-primary-600">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="text-3xl font-extrabold text-primary-700">NEXUS</div>
          <p className="text-gray-500 text-sm mt-1">Recuperar contraseña</p>
        </div>

        {/* Indicador de pasos */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {(['correo', 'codigo', 'nueva'] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors
                ${step === s
                  ? 'bg-primary-600 text-white'
                  : stepIndex > i
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-500'}`}>
                {i + 1}
              </div>
              {i < 2 && <div className={`w-8 h-0.5 ${stepIndex > i ? 'bg-green-400' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        {/* PASO 1 — Correo */}
        {step === 'correo' && (
          <form onSubmit={handleSolicitarCodigo} className="space-y-4">
            <p className="text-gray-600 text-sm">
              Ingresa tu correo registrado y te enviaremos un código de verificación.
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
              <input
                type="email"
                className="input-field"
                placeholder="correo@ejemplo.com"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
              />
            </div>
            {error   && <p className="text-red-600 text-sm bg-red-50 rounded-lg px-3 py-2">{error}</p>}
            {mensaje && <p className="text-green-600 text-sm bg-green-50 rounded-lg px-3 py-2">{mensaje}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? 'Enviando...' : 'Enviar código'}
            </button>
          </form>
        )}

        {/* PASO 2 — Código */}
        {step === 'codigo' && (
          <form onSubmit={handleValidarCodigo} className="space-y-4">
            <p className="text-gray-600 text-sm">
              Ingresa el código de 6 dígitos enviado a <strong>{correo}</strong>
            </p>

            {codigoDev && (
              <div className="bg-yellow-50 border border-yellow-300 rounded-lg px-4 py-3 text-center">
                <p className="text-yellow-700 text-xs font-medium mb-1">Modo desarrollo</p>
                <p className="text-2xl font-bold tracking-widest text-yellow-800">{codigoDev}</p>
              </div>
            )}

            <input
              className="input-field text-center text-2xl tracking-widest font-bold"
              maxLength={6}
              placeholder="000000"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value.replace(/\D/g, ''))}
              required
            />
            {error && <p className="text-red-600 text-sm bg-red-50 rounded-lg px-3 py-2">{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? 'Verificando...' : 'Verificar código'}
            </button>
            <button
              type="button"
              onClick={() => { setStep('correo'); setError(''); setCodigo(''); }}
              className="btn-secondary w-full"
            >
              ← Cambiar correo
            </button>
          </form>
        )}

        {/* PASO 3 — Nueva contraseña */}
        {step === 'nueva' && (
          <form onSubmit={handleRestablecerPassword} className="space-y-4">
            <p className="text-gray-600 text-sm">Establece tu nueva contraseña.</p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nueva contraseña</label>
              <input
                type="password"
                className="input-field"
                placeholder="Mínimo 6 caracteres"
                value={nuevaPassword}
                onChange={(e) => setNuevaPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar contraseña</label>
              <input
                type="password"
                className="input-field"
                placeholder="Repite la contraseña"
                value={confirmar}
                onChange={(e) => setConfirmar(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-600 text-sm bg-red-50 rounded-lg px-3 py-2">{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? 'Guardando...' : 'Restablecer contraseña'}
            </button>
          </form>
        )}

        <p className="text-center text-sm text-gray-500 mt-4">
          <Link href="/login" className="text-primary-600 hover:underline">
            Volver al inicio de sesión
          </Link>
        </p>
      </div>
    </div>
  );
}