import { Component, OnInit } from '@angular/core';
import { Board } from '../shared/board.model';
import { Column } from '../shared/column.model';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

const boards = [
  new Board("Project Tasks",
    [
      new Column("POC", ['Get to work',
        'Pick up groceries',
        'Go home',
        'Fall asleep']),
      new Column("Todo", ['Get to work',
        'Pick up groceries',
        'Go home',
        'Fall asleep']),
      new Column("In progress", ['Get to work',
        'Pick up groceries',
        'Go home',
        'Fall asleep']),
      new Column("Completed", ['Get to work',
        'Pick up groceries',
        'Go home',
        'Fall asleep']),

    ]
  )
];

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {

  boards: Board[];

  constructor() {
    this.boards = boards;
  }

  ngOnInit(): void {
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
  }

}
