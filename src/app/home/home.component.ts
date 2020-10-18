import {Component, OnInit} from '@angular/core';
import {createHttpObservable} from '../common/util';
import {map} from 'rxjs/operators';
import {Course} from '../model/course';
import {noop} from 'rxjs';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  beginnerCourses: Course[] = [];
  advancedCourses: Course[] = [];

  constructor() {
  }

  ngOnInit() {
    const http$ = createHttpObservable('/api/courses');
    const courses$ = http$.pipe(
      map(res => res['payload'])
    );

    courses$.subscribe(
      courses => {
        this.beginnerCourses = courses.filter(course => course.category === 'BEGINNER');
        this.advancedCourses = courses.filter(course => course.category === 'ADVANCED');
      },
      noop,
      () => console.log('Completed')
    );
  }

}
