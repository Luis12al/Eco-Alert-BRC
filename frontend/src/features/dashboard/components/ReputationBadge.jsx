import React from 'react';
import { Award, TrendingUp, TrendingDown } from 'lucide-react';
import { useAuthStore } from '../../../stores/authStore.js';
import { getReputationInfo } from '../../../utils/constants.js';
import Card from '../../../components/ui/Card.jsx';

const ReputationBadge = () => {
  const { user } = useAuthStore();
  const info = getReputationInfo(user?.reputation || 0);

  return (
    <Card>
      <Card.Content>
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-full ${info.color.replace('text-', 'bg-').replace('600', '100')}`}>
            <Award className={`h-6 w-6 ${info.color}`} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Tu reputación</p>
            <div className="flex items-center gap-2">
              <p className={`text-2xl font-bold ${info.color}`}>
                {user?.reputation > 0 ? '+' : ''}{user?.reputation || 0}
              </p>
              <span className="text-sm text-gray-500">({info.label})</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Nivel actual</span>
            <span>Siguiente nivel</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(((user?.reputation || 0) + 50) / 100 * 100, 100)}%` }}
            />
          </div>
        </div>

        <div className="mt-3 text-xs text-gray-500">
          {user?.reputation >= 0 ? (
            <span className="flex items-center gap-1 text-green-600">
              <TrendingUp className="h-3 w-3" />
              ¡Sigue reportando para subir de nivel!
            </span>
          ) : (
            <span className="flex items-center gap-1 text-red-600">
              <TrendingDown className="h-3 w-3" />
              Tu reputación está baja. Reporta con cuidado.
            </span>
          )}
        </div>
      </Card.Content>
    </Card>
  );
};

export default ReputationBadge;