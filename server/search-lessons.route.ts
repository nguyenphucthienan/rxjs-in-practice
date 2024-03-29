import {Request, Response} from 'express';
import {LESSONS} from './db-data';
import {setTimeout} from 'timers';

export function searchLessons(req: Request, res: Response) {
  const queryParams = req.query;
  const courseId = parseInt(<string>queryParams.courseId, 10);
  const filter = queryParams.filter || '';
  const sortOrder = queryParams.sortOrder || 'asc';
  const pageNumber = parseInt(<string>queryParams.pageNumber, 10) || 0;
  const pageSize = parseInt(<string>queryParams.pageSize, 10) || 3;

  let lessons = Object.values(LESSONS).filter(lesson => lesson.courseId === courseId).sort((l1, l2) => l1.id - l2.id);

  if (filter) {
    lessons = lessons.filter(lesson => lesson.description.trim().toLowerCase().search((<string>filter).toLowerCase()) >= 0);
  }

  if (sortOrder === 'desc') {
    lessons = lessons.reverse();
  }

  const initialPos = pageNumber * pageSize;
  const lessonsPage = lessons.slice(initialPos, initialPos + pageSize);

  setTimeout(() => {
    res.status(200).json({payload: lessonsPage});
  }, 1000);
}
