import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../../../stores/authStore.js';
import Button from '../../../components/ui/Button.jsx';
import Input from '../../../components/ui/Input.jsx';

const LoginForm = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuthStore();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    clearError();
    setFieldErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errors = {};
    if (!formData.email) errors.email = 'El email es requerido';
    if (!formData.password) errors.password = 'La contraseña es requerida';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const success = await login(formData.email, formData.password);
    if (success) {
      navigate('/mapa');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        name="email"
        type="email"
        label="Correo electrónico"
        placeholder="tu@email.com"
        value={formData.email}
        onChange={handleChange}
        error={fieldErrors.email}
        icon={Mail}
        autoComplete="email"
      />

      <div className="relative">
        <Input
          name="password"
          type={showPassword ? 'text' : 'password'}
          label="Contraseña"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          error={fieldErrors.password}
          icon={Lock}
          autoComplete="current-password"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600"
        >
          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <Button 
        type="submit" 
        className="w-full" 
        isLoading={isLoading}
      >
        Iniciar sesión
      </Button>

      <div className="text-center text-sm">
        <span className="text-gray-500">¿No tienes cuenta? </span>
        <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
          Regístrate
        </Link>
      </div>
    </form>
  );
};

export default LoginForm;