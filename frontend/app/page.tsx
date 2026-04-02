'use client';

import { useState } from 'react';

export default function Home() {
  // Feature 1: Backend Connection Test
  const [connectionLoading, setConnectionLoading] = useState(false);
  const [connectionMessage, setConnectionMessage] = useState('');
  const [connectionError, setConnectionError] = useState('');

  // Feature 2: Form Data
  const [formData, setFormData] = useState({ nombre: '', edad: '' });
  const [formErrors, setFormErrors] = useState({ nombre: '', edad: '' });
  const [formLoading, setFormLoading] = useState(false);
  const [formResponse, setFormResponse] = useState('');
  const [formError, setFormError] = useState('');

  // Feature 1: Test Backend Connection
  const handleTestConnection = async () => {
    setConnectionLoading(true);
    setConnectionMessage('');
    setConnectionError('');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        throw new Error('API URL not configured');
      }

      const response = await fetch(`${apiUrl}/saludo`);
      const data = await response.json();
      console.log('Backend response:', data);

      if (response.ok) {
        setConnectionMessage(data.message || 'Conexión exitosa');
      } else {
        setConnectionError('Error al conectar con el backend');
      }
    } catch (error) {
      console.error('Connection error:', error);
      setConnectionError('Error al conectar con el backend');
    } finally {
      setConnectionLoading(false);
    }
  };

  // Feature 2: Validate Form
  const validateForm = () => {
    const errors = { nombre: '', edad: '' };
    let isValid = true;

    if (!formData.nombre.trim()) {
      errors.nombre = 'El nombre no puede estar vacío';
      isValid = false;
    }

    const age = parseInt(formData.edad);
    if (!formData.edad || age <= 0) {
      errors.edad = 'La edad debe ser mayor a 0';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  // Feature 2: Handle Form Submit
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setFormLoading(true);
    setFormResponse('');
    setFormError('');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        throw new Error('API URL not configured');
      }

      const response = await fetch(`${apiUrl}/procesar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: formData.nombre,
          edad: parseInt(formData.edad),
        }),
      });

      const data = await response.json();
      console.log('Form response:', data);

      if (response.ok) {
        setFormResponse(data.message || 'Datos enviados correctamente');
        setFormData({ nombre: '', edad: '' });
      } else {
        setFormError('Error al enviar los datos');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setFormError('Error al enviar los datos');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-8 font-sans">
      <main className="w-full max-w-2xl">
        <h1 className="mb-12 text-center text-4xl font-bold text-slate-900">
          Práctica Vercel & Railway
        </h1>

        <div className="space-y-8">
          {/* Feature 1: Test Connection */}
          <section className="rounded-lg border border-slate-200 bg-white p-8 shadow-md">
            <h2 className="mb-6 text-2xl font-semibold text-slate-800">
              Test de conexión
            </h2>

            <button
              onClick={handleTestConnection}
              disabled={connectionLoading}
              className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:bg-blue-400"
            >
              {connectionLoading ? 'Conectando...' : 'Probar conexión con backend'}
            </button>

            {connectionMessage && (
              <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4">
                <p className="text-green-800">{connectionMessage}</p>
              </div>
            )}

            {connectionError && (
              <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4">
                <p className="text-red-800">{connectionError}</p>
              </div>
            )}
          </section>

          {/* Feature 2: Interactive Form */}
          <section className="rounded-lg border border-slate-200 bg-white p-8 shadow-md">
            <h2 className="mb-6 text-2xl font-semibold text-slate-800">
              Formulario interactivo
            </h2>

            <form onSubmit={handleFormSubmit} className="space-y-6">
              {/* Name Input */}
              <div className="flex flex-col gap-2">
                <label htmlFor="nombre" className="font-medium text-slate-700">
                  Nombre
                </label>
                <input
                  id="nombre"
                  type="text"
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                  className="rounded-lg border border-slate-300 px-4 py-2 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="Tu nombre"
                />
                {formErrors.nombre && (
                  <p className="text-sm text-red-600">{formErrors.nombre}</p>
                )}
              </div>

              {/* Age Input */}
              <div className="flex flex-col gap-2">
                <label htmlFor="edad" className="font-medium text-slate-700">
                  Edad
                </label>
                <input
                  id="edad"
                  type="number"
                  value={formData.edad}
                  onChange={(e) =>
                    setFormData({ ...formData, edad: e.target.value })
                  }
                  className="rounded-lg border border-slate-300 px-4 py-2 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="Tu edad"
                />
                {formErrors.edad && (
                  <p className="text-sm text-red-600">{formErrors.edad}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={formLoading}
                className="w-full rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-700 disabled:bg-green-400"
              >
                {formLoading ? 'Enviando...' : 'Enviar datos'}
              </button>
            </form>

            {/* Success Response */}
            {formResponse && (
              <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4">
                <p className="text-green-800">{formResponse}</p>
              </div>
            )}

            {/* Error Response */}
            {formError && (
              <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4">
                <p className="text-red-800">{formError}</p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
