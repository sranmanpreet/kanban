import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Column } from './column.model';
import { Board } from './board.model';

@Injectable({
  providedIn: 'root'
})
export class EditService {
  editModeObserver = new Subject<boolean>();
  currentBoard: Board;
  boards = new Array(
    new Board("Project Tasks",
      [
        new Column("POC", ['Get to work',
          'Pick up groceries',
          'Go home',
          'Fall asleep',
          'Get to work',
          'Go home',
          'Fall asleep',
          'Get to work',
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
        new Column("Re Done", ['Get to work',
          'Pick up groceries',
          'Go home',
          'Fall asleep'])

      ]
    )
  );

  constructor() {}

  toggleEditMode(flag) {
    this.editModeObserver.next(flag);
  }

  addBoard(board: Board) {
    this.boards.push(new Board(board.name, board.columns));
  }

  updateBoardName(name: string, boardIndex: number) {
    this.boards[boardIndex].name = name;
  }

  deleteBoard(index: number) {
    this.boards.splice(index, 1);
  }

  addColumn(boardIndex: number, title: string, tasks: string[]) {
    console.log(boardIndex + "  " + title + "   " + tasks);
    this.boards[boardIndex].columns.push(new Column(title, tasks));
  }

  updateColumnTitle(title: string, columnIndex: number, boardIndex: number) {
    this.boards[boardIndex].columns[columnIndex].title = title;
  }

  deleteColumn(columnIndex: number, boardIndex: number) {
    this.boards[boardIndex].columns.splice(columnIndex, 1);
  }

  addTask(task: string, columnIndex: number, boardIndex: number) {
    this.boards[boardIndex].columns[columnIndex].tasks.push(task);
  }

  updateTask(task: string, taskIndex: number, columnIndex: number, boardIndex: number){
    this.boards[boardIndex].columns[columnIndex].tasks[taskIndex] = task;
  }

  deleteTask(taskIndex: number, columnIndex: number, boardIndex: number){
    this.boards[boardIndex].columns[columnIndex].tasks.splice(taskIndex, 1);
  }

}
