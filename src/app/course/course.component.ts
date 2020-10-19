import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Course} from '../model/course';
import {fromEvent, Observable} from 'rxjs';
import {Lesson} from '../model/lesson';
import {createHttpObservable} from '../common/util';
import {debounceTime, distinctUntilChanged, map, startWith, switchMap} from 'rxjs/operators';
import {debug, RxJsLoggingLevel} from '../common/debug';
import {Store} from '../common/store.service';

@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit, AfterViewInit {

  courseId: number;
  course$: Observable<Course>;
  lessons$: Observable<Lesson[]>;

  @ViewChild('searchInput', {static: true}) input: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private store: Store
  ) {
  }

  ngOnInit() {
    this.courseId = parseInt(this.route.snapshot.params['id'], 10);
    this.course$ = this.store.selectCourseById(this.courseId);
  }

  ngAfterViewInit() {
    this.lessons$ = fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        map((event: Event) => (event.target as HTMLInputElement).value),
        startWith(''),
        debug(RxJsLoggingLevel.INFO, 'Search'),
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(search => this.loadLessons(search)),
        debug(RxJsLoggingLevel.INFO, 'Lessons'),
      );
  }

  loadLessons(search = ''): Observable<Lesson[]> {
    return createHttpObservable(`/api/lessons?courseId=${this.courseId}&pageSize=100&filter=${search}`)
      .pipe(
        map(res => res['payload'])
      );
  }

}
