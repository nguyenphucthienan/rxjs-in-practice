import {Component, OnInit} from '@angular/core';
import {createHttpObservable} from '../common/util';
import {catchError, finalize, map, shareReplay} from 'rxjs/operators';
import {Course} from '../model/course';
import {Observable, throwError} from 'rxjs';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  beginnerCourses$: Observable<Course[]>;
  advancedCourses$: Observable<Course[]>;

  constructor() {
  }

  ngOnInit() {
    const http$ = createHttpObservable('/api/courses');
    const courses$: Observable<Course[]> = http$.pipe(
      catchError(err => {
        console.log('Error occurred', err);
        return throwError(err);
      }),
      finalize(() => {
        console.log('Finalize executed');
      }),
      map(res => res['payload']),
      shareReplay(),
    );

    this.beginnerCourses$ = courses$
      .pipe(
        map(courses => courses
          .filter(course => course.category === 'BEGINNER'))
      );

    this.advancedCourses$ = courses$
      .pipe(
        map(courses => courses
          .filter(course => course.category === 'ADVANCED'))
      );
  }

}
