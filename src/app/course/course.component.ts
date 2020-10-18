import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Course} from '../model/course';
import {Observable} from 'rxjs';
import {Lesson} from '../model/lesson';
import {createHttpObservable} from '../common/util';
import {map} from 'rxjs/operators';

@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit, AfterViewInit {

  course$: Observable<Course>;
  lessons$: Observable<Lesson[]>;

  @ViewChild('searchInput', {static: true}) input: ElementRef;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    const courseId = this.route.snapshot.params['id'];
    this.course$ = createHttpObservable(`/api/courses/${courseId}`);
    this.lessons$ = createHttpObservable(`/api/lessons?courseId=${courseId}&pageSize=100`)
      .pipe(
        map(res => res['payload'])
      );
  }

  ngAfterViewInit() {
  }

}
