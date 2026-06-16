import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../../../stores/authStore.js';
import Button from '../../../components/ui/Button.jsx';
import Input from '../../../components/ui/Input.jsx';
import { isValidEmail, isValidPassword } from '../../../utils/validators.js';

const RegisterForm = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuthStore();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
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
    
    if (!formData.name.trim()) {
      errors.name = 'El nombre es requerido';
    } else if (formData.name.length < 2) {
      errors.name = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!formData.email) {
      errors.email = 'El email es requerido';
    } else if (!isValidEmail(formData.email)) {
      errors.email = 'El email no es válido';
    }

    if (!formData.password) {
      errors.password = 'La contraseña es requerida';
    } else if (!isValidPassword(formData.password)) {
      errors.password = 'Mínimo 8 caracteres, mayúscula, minúscula y número';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const success = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    });

    if (success) {
      navigate('/mapa');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        name="name"
        label="Nombre completo"
        placeholder="Juan Pérez"
        value={formData.name}
        onChange={handleChange}
        error={fieldErrors.name}
        icon={User}
      />

      <Input
        name="email"
        type="email"
        label="Correo electrónico"
        placeholder="tu@email.com"
        value={formData.email}
        onChange={handleChange}
        error={fieldErrors.email}
        icon={Mail}
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
          helperText="Mínimo 8 caracteres, mayúscula, minúscula y número"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600"
        >
          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>

      <Input
        name="confirmPassword"
        type="password"
        label="Confirmar contraseña"
        placeholder="••••••••"
        value={formData.confirmPassword}
        onChange={handleChange}
        error={fieldErrors.confirmPassword}
        icon={Lock}
      />

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
        Crear cuenta
      </Button>

      <div className="text-center text-sm">
        <span className="text-gray-500">¿Ya tienes cuenta? </span>
        <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
          Inicia sesión
        </Link>
      </div>
    </form>
  );
};

export default RegisterForm;