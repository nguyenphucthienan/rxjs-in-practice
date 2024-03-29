import {Request, Response} from 'express';
import {COURSES} from './db-data';

export function getAllCourses(req: Request, res: Response) {
  // const error = (Math.random() >= 0.5);
  // if (error) {
  //   res.status(500).json({message: 'Random error occurred.'});
  // } else {
  setTimeout(() => {
    res.status(200).json({payload: Object.values(COURSES)});
  }, 200);
  // }
}

export function getCourseById(req: Request, res: Response) {
  const courseId = parseInt(req.params['id'], 10);
  const courses: any = Object.values(COURSES);
  const course = courses.find(c => c.id === courseId);
  res.status(200).json(course);
}
