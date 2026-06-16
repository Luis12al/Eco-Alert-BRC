import React, { useState } from 'react';
import { Send, Trash2, User } from 'lucide-react';
import { useAuthStore } from '../../../stores/authStore.js';
import { formatRelativeDate } from '../../../utils/formatters.js';
import Button from '../../../components/ui/Button.jsx';

const CommentList = ({ comments, onSubmit, onDelete, isLoading }) => {
  const { user, isAuthenticated } = useAuthStore();
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    onSubmit(newComment);
    setNewComment('');
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">
        Comentarios ({comments?.length || 0})
      </h3>

      {/* Formulario de comentario */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
            ) : (
              <User className="h-5 w-5 text-primary-600" />
            )}
          </div>
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escribe un comentario..."
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            />
            <div className="flex justify-end mt-2">
              <Button type="submit" size="sm" isLoading={isLoading} className="gap-2">
                <Send className="h-4 w-4" />
                Comentar
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <p className="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded-lg">
          Inicia sesión para comentar
        </p>
      )}

      {/* Lista de comentarios */}
      <div className="space-y-4">
        {comments?.map((comment) => (
          <div key={comment.id} className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
              {comment.author_avatar ? (
                <img src={comment.author_avatar} alt="" className="w-full h-full rounded-full object-cover" />
              ) : (
                <User className="h-5 w-5 text-gray-400" />
              )}
            </div>
            <div className="flex-1">
              <div className="bg-gray-50 rounded-lg px-4 py-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm text-gray-900">
                    {comment.author_name}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatRelativeDate(comment.created_at)}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{comment.content}</p>
              </div>
              {user?.id === comment.user_id && (
                <button
                  onClick={() => onDelete(comment.id)}
                  className="mt-1 text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
                >
                  <Trash2 className="h-3 w-3" />
                  Eliminar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentList;