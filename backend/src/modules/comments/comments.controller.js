import { CommentsService } from './comments.service.js';
import { catchAsync } from '../../shared/utils/catchAsync.js';
import { successResponse } from '../../shared/utils/response.js';

export const CommentsController = {
  create: catchAsync(async (req, res) => {
    const comment = await CommentsService.create({
      reportId: req.params.reportId,
      userId: req.user.id,
      content: req.body.content,
    });
    successResponse(res, comment, 'Comentario creado', 201);
  }),

  getByReport: catchAsync(async (req, res) => {
    const comments = await CommentsService.getByReport(req.params.reportId);
    successResponse(res, comments, 'Comentarios obtenidos');
  }),

  delete: catchAsync(async (req, res) => {
    await CommentsService.delete(req.params.id, req.user.id);
    successResponse(res, null, 'Comentario eliminado');
  }),
};