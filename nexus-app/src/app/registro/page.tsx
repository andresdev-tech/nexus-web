'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authAPI } from '../../lib/api';

export default function RegistroPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    nombres: '', apellidos: '', tipo_documento_id: '1',
    numero_documento: '', fecha_nacimiento: '',
    correo_electronico: '', password: '', confirmar_password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmar_password) {
      return setError('Las contraseñas no coinciden.');
    }
    setLoading(true);
    try {
      await authAPI.registrar({
        nombres: form.nombres,
        apellidos: form.apellidos,
        tipo_documento_id: parseInt(form.tipo_documento_id),
        numero_documento: form.numero_documento,
        fecha_nacimiento: form.fecha_nacimiento || undefined,
        correo_electronico: form.correo_electronico,
        password: form.password,
      });
      router.push('/login?registered=true');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrarse.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-900 to-primary-600 py-10">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg">
        <div className="text-center mb-6">
          <div className="text-3xl font-extrabold text-primary-700">NEXUS</div>
          <p className="text-gray-500 text-sm mt-1">Crear nueva cuenta</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombres</label>
              <input name="nombres" className="input-field" required value={form.nombres} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Apellidos</label>
              <input name="apellidos" className="input-field" required value={form.apellidos} onChange={handleChange} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de documento</label>
              <select name="tipo_documento_id" className="input-field" value={form.tipo_documento_id} onChange={handleChange}>
                <option value="1">Cédula de Ciudadanía</option>
                <option value="2">Tarjeta de Identidad</option>
                <option value="3">Cédula de Extranjería</option>
                <option value="4">Pasaporte</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">N° Documento</label>
              <input name="numero_documento" className="input-field" required value={form.numero_documento} onChange={handleChange} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de nacimiento</label>
            <input type="date" name="fecha_nacimiento" className="input-field" value={form.fecha_nacimiento} onChange={handleChange} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
            <input type="email" name="correo_electronico" className="input-field" required value={form.correo_electronico} onChange={handleChange} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <input type="password" name="password" className="input-field" required value={form.password} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar</label>
              <input type="password" name="confirmar_password" className="input-field" required value={form.confirmar_password} onChange={handleChange} />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">{error}</div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full py-3">
            {loading ? 'Registrando...' : 'Crear Cuenta'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="text-primary-600 font-medium hover:underline">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}
