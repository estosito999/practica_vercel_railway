'use client';

import { useState, useEffect } from 'react';

function WinClock() {
  const [time, setTime] = useState('');
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
      );
    };
    update();
    const id = setInterval(update, 10000);
    return () => clearInterval(id);
  }, []);
  return <span>{time}</span>;
}

interface WinWindowProps {
  title: string;
  icon?: string;
  children: React.ReactNode;
}

function WinWindow({ title, icon = '🖥', children }: WinWindowProps) {
  return (
    <div className="win-window">
      {/* Title bar */}
      <div className="win-titlebar">
        <div className="flex items-center gap-1">
          <span style={{ fontSize: 12 }}>{icon}</span>
          <span>{title}</span>
        </div>
        <div className="flex items-center">
          <button className="win-btn-chrome" aria-label="Minimizar">_</button>
          <button className="win-btn-chrome" aria-label="Maximizar">▢</button>
          <button className="win-btn-chrome" aria-label="Cerrar" style={{ fontWeight: 'bold' }}>✕</button>
        </div>
      </div>
      {/* Menu bar */}
      <div
        style={{
          backgroundColor: '#d4d0c8',
          borderBottom: '1px solid #808080',
          padding: '2px 4px',
          fontSize: 11,
          display: 'flex',
          gap: 12,
        }}
      >
        <span style={{ cursor: 'default', padding: '1px 4px' }}>Archivo</span>
        <span style={{ cursor: 'default', padding: '1px 4px' }}>Editar</span>
        <span style={{ cursor: 'default', padding: '1px 4px' }}>Ver</span>
        <span style={{ cursor: 'default', padding: '1px 4px' }}>Ayuda</span>
      </div>
      {/* Content */}
      <div style={{ padding: 12, backgroundColor: '#d4d0c8' }}>{children}</div>
      {/* Status bar */}
      <div className="win-statusbar">
        <div className="win-statusbar-cell">Listo</div>
        <div className="win-statusbar-cell" style={{ flex: 2 }}>
          Práctica Vercel &amp; Railway
        </div>
      </div>
    </div>
  );
}

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

  const handleTestConnection = async () => {
    setConnectionLoading(true);
    setConnectionMessage('');
    setConnectionError('');
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) throw new Error('API URL not configured');
      const response = await fetch(`${apiUrl}/saludo`);
      const data = await response.json();
      if (response.ok) {
        setConnectionMessage(data.message || 'Conexión exitosa');
      } else {
        setConnectionError('Error al conectar con el backend');
      }
    } catch {
      setConnectionError('Error al conectar con el backend');
    } finally {
      setConnectionLoading(false);
    }
  };

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

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setFormLoading(true);
    setFormResponse('');
    setFormError('');
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) throw new Error('API URL not configured');
      const response = await fetch(`${apiUrl}/procesar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: formData.nombre, edad: parseInt(formData.edad) }),
      });
      const data = await response.json();
      if (response.ok) {
        setFormResponse(data.message || 'Datos enviados correctamente');
        setFormData({ nombre: '', edad: '' });
      } else {
        setFormError('Error al enviar los datos');
      }
    } catch {
      setFormError('Error al enviar los datos');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <>
      {/* Desktop */}
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#008080',
          backgroundImage: 'none',
          paddingBottom: 32,
          paddingTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          fontFamily: "'Tahoma', 'MS Sans Serif', Arial, sans-serif",
        }}
      >
        {/* Desktop icons row */}
        <div
          style={{
            alignSelf: 'flex-start',
            paddingLeft: 12,
            paddingTop: 8,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            marginBottom: 8,
          }}
        >
          {[
            { icon: '💻', label: 'Mi PC' },
            { icon: '🌐', label: 'Internet Explorer' },
            { icon: '🗑', label: 'Papelera' },
          ].map(({ icon, label }) => (
            <div
              key={label}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                cursor: 'default',
                width: 60,
              }}
            >
              <span style={{ fontSize: 28 }}>{icon}</span>
              <span
                style={{
                  fontSize: 11,
                  color: '#ffffff',
                  textAlign: 'center',
                  textShadow: '1px 1px 1px #000000',
                  lineHeight: 1.2,
                }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Main content area */}
        <div style={{ width: '100%', maxWidth: 560, padding: '0 8px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Title window */}
          <div className="win-window">
            <div className="win-titlebar">
              <div className="flex items-center gap-1">
                <span style={{ fontSize: 12 }}>🖥</span>
                <span>Práctica Vercel &amp; Railway — v1.0</span>
              </div>
              <div className="flex items-center">
                <button className="win-btn-chrome" aria-label="Minimizar">_</button>
                <button className="win-btn-chrome" aria-label="Maximizar">▢</button>
                <button className="win-btn-chrome" aria-label="Cerrar">✕</button>
              </div>
            </div>
            <div style={{ backgroundColor: '#d4d0c8', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 36 }}>🖥</span>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: 13, marginBottom: 2 }}>
                  Práctica Vercel &amp; Railway
                </div>
                <div style={{ fontSize: 11, color: '#444444' }}>
                  Sistema de prueba de conexión y formulario interactivo.
                </div>
                <div style={{ fontSize: 11, color: '#808080', marginTop: 4 }}>
                  © 2000 Microsoft Corporation. Todos los derechos reservados.
                </div>
              </div>
            </div>
          </div>

          {/* Feature 1: Test Connection */}
          <WinWindow title="Test de Conexión" icon="🔌">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div
                className="win-sunken"
                style={{
                  backgroundColor: '#ffffff',
                  padding: 8,
                  minHeight: 48,
                  fontSize: 11,
                  color: connectionMessage ? '#000000' : connectionError ? '#cc0000' : '#808080',
                }}
              >
                {connectionMessage || connectionError || 'Haga clic en el botón para probar la conexión con el servidor.'}
              </div>

              {connectionMessage && (
                <div className="win-alert-success">
                  <span style={{ fontSize: 18, flexShrink: 0 }}>ℹ</span>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: 11, marginBottom: 2 }}>Conexión exitosa</div>
                    <div style={{ fontSize: 11 }}>{connectionMessage}</div>
                  </div>
                </div>
              )}

              {connectionError && (
                <div className="win-alert-error">
                  <span style={{ fontSize: 18, flexShrink: 0, color: '#cc0000' }}>⚠</span>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: 11, marginBottom: 2, color: '#cc0000' }}>Error</div>
                    <div style={{ fontSize: 11 }}>{connectionError}</div>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, marginTop: 4 }}>
                <button
                  className="win-button"
                  onClick={handleTestConnection}
                  disabled={connectionLoading}
                >
                  {connectionLoading ? 'Conectando...' : 'Probar conexión'}
                </button>
                <button
                  className="win-button"
                  onClick={() => { setConnectionMessage(''); setConnectionError(''); }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </WinWindow>

          {/* Feature 2: Interactive Form */}
          <WinWindow title="Formulario Interactivo" icon="📝">
            <form onSubmit={handleFormSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {/* Name field */}
                <div>
                  <label
                    htmlFor="nombre"
                    style={{ display: 'block', fontSize: 11, marginBottom: 3, fontWeight: 'bold' }}
                  >
                    Nombre:
                  </label>
                  <input
                    id="nombre"
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="win-input"
                    placeholder="Ingrese su nombre"
                  />
                  {formErrors.nombre && (
                    <div style={{ fontSize: 11, color: '#cc0000', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span>⚠</span> {formErrors.nombre}
                    </div>
                  )}
                </div>

                {/* Age field */}
                <div>
                  <label
                    htmlFor="edad"
                    style={{ display: 'block', fontSize: 11, marginBottom: 3, fontWeight: 'bold' }}
                  >
                    Edad:
                  </label>
                  <input
                    id="edad"
                    type="number"
                    value={formData.edad}
                    onChange={(e) => setFormData({ ...formData, edad: e.target.value })}
                    className="win-input"
                    placeholder="Ingrese su edad"
                    style={{ width: 120 }}
                  />
                  {formErrors.edad && (
                    <div style={{ fontSize: 11, color: '#cc0000', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span>⚠</span> {formErrors.edad}
                    </div>
                  )}
                </div>

                {/* Separator */}
                <div style={{ borderTop: '1px solid #808080', borderBottom: '1px solid #ffffff', margin: '4px 0' }} />

                {/* Success/Error responses */}
                {formResponse && (
                  <div className="win-alert-success">
                    <span style={{ fontSize: 18, flexShrink: 0 }}>✅</span>
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: 11, marginBottom: 2 }}>Operación completada</div>
                      <div style={{ fontSize: 11 }}>{formResponse}</div>
                    </div>
                  </div>
                )}
                {formError && (
                  <div className="win-alert-error">
                    <span style={{ fontSize: 18, flexShrink: 0, color: '#cc0000' }}>⚠</span>
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: 11, marginBottom: 2, color: '#cc0000' }}>Error</div>
                      <div style={{ fontSize: 11 }}>{formError}</div>
                    </div>
                  </div>
                )}

                {/* Buttons */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
                  <button
                    type="submit"
                    className="win-button"
                    disabled={formLoading}
                  >
                    {formLoading ? 'Enviando...' : 'Aceptar'}
                  </button>
                  <button
                    type="button"
                    className="win-button"
                    onClick={() => {
                      setFormData({ nombre: '', edad: '' });
                      setFormErrors({ nombre: '', edad: '' });
                      setFormResponse('');
                      setFormError('');
                    }}
                  >
                    Cancelar
                  </button>
                  <button type="button" className="win-button">
                    Ayuda
                  </button>
                </div>
              </div>
            </form>
          </WinWindow>
        </div>
      </div>

      {/* Taskbar */}
      <div className="win-taskbar">
        {/* Start button */}
        <button className="win-start-btn">
          <span style={{ fontSize: 14 }}>⊞</span>
          <span>Inicio</span>
        </button>

        {/* Separator */}
        <div style={{ width: 2, height: 20, borderLeft: '1px solid #808080', borderRight: '1px solid #ffffff', margin: '0 2px' }} />

        {/* Quick launch icon */}
        <button
          className="win-button"
          style={{ height: 22, padding: '0 8px', fontSize: 11, minWidth: 'unset' }}
          title="Internet Explorer"
        >
          🌐
        </button>

        {/* Active window button */}
        <div
          style={{
            height: 22,
            padding: '0 8px',
            fontSize: 11,
            backgroundColor: '#bdb9b0',
            borderTop: '1px solid #404040',
            borderLeft: '1px solid #404040',
            borderRight: '1px solid #ffffff',
            borderBottom: '1px solid #ffffff',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            boxShadow: 'inset 1px 1px 0 #808080',
          }}
        >
          <span>🖥</span>
          <span>Práctica Vercel</span>
        </div>

        {/* Clock tray */}
        <div className="win-tray">
          <WinClock />
        </div>
      </div>
    </>
  );
}
