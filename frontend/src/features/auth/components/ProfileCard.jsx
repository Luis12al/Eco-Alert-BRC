import React from 'react';
import { User, Mail, Award, Calendar } from 'lucide-react';
import { useAuthStore } from '../../../stores/authStore.js';
import { getReputationInfo } from '../../../utils/constants.js';
import { formatDate } from '../../../utils/formatters.js';
import Card from '../../../components/ui/Card.jsx';
import Badge from '../../../components/ui/Badge.jsx';

const ProfileCard = () => {
  const { user } = useAuthStore();
  
  // Manejar caso donde user es null (carga inicial)
  if (!user) {
    return (
      <Card>
        <Card.Content className="flex items-center justify-center py-8">
          <div className="animate-pulse flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
          </div>
        </Card.Content>
      </Card>
    );
  }

  const reputationInfo = getReputationInfo(user.reputation || 0);

  return (
    <Card>
      <Card.Content className="flex flex-col items-center text-center">
        <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center mb-4 overflow-hidden">
          {user.avatar_url ? (
            <img 
              src={user.avatar_url} 
              alt={user.name || 'Usuario'} 
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="h-12 w-12 text-primary-600" />
          )}
        </div>
        
        <h2 className="text-xl font-bold text-gray-900">{user.name || 'Usuario'}</h2>
        <p className="text-gray-500 flex items-center gap-1 mt-1">
          <Mail className="h-4 w-4" />
          {user.email || 'Email no disponible'}
        </p>
        
        <div className="flex items-center gap-2 mt-3">
          <Badge variant="primary" className="gap-1">
            <Award className="h-3 w-3" />
            {reputationInfo.label}
          </Badge>
          <span className={`text-sm font-medium ${reputationInfo.color}`}>
            {user.reputation > 0 ? '+' : ''}{user.reputation || 0} pts
          </span>
        </div>
        
        <div className="flex items-center gap-1 mt-2 text-sm text-gray-400">
          <Calendar className="h-4 w-4" />
          Miembro desde {formatDate(user.created_at)}
        </div>
      </Card.Content>
    </Card>
  );
};

export default ProfileCard;