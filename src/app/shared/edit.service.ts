import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Column } from './column.model';
import { Board } from './board.model';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class EditService {
  editModeObserver = new Subject<boolean>();
  currentBoard: Board;
  boards: Board[];

  constructor(private cookieService: CookieService) { 
    if(this.cookieService.check('boards')){
      this.loadBoards();
    } else{
      this.boards =  new Array(
        new Board("Personal Board",
          [
            new Column("Todo", 
            ['Take pet to vet']),
            new Column("Doing Today", 
            ['Ask Sam for logo',
              'Car Wash',
              'Get Milk']),
            new Column("Done", 
            ['Plan for Party',
              'Send Party Invite'])
          ]
        )
      );
    }
  }

  toggleEditMode(flag) {
    this.cookieService.set('editmode', JSON.stringify(flag));
    this.editModeObserver.next(flag);
  }

  addBoard(board: Board) {
    this.boards.push(new Board(board.name, board.columns));
    this.saveBoards();
  }

  updateBoardName(name: string, boardIndex: number) {
    this.boards[boardIndex].name = name;
    this.saveBoards();
  }

  deleteBoard(index: number) {
    this.boards.splice(index, 1);
    this.saveBoards();
  }

  addColumn(boardIndex: number, title: string, tasks: string[]) {
    console.log(boardIndex + "  " + title + "   " + tasks);
    this.boards[boardIndex].columns.push(new Column(title, tasks));
    this.saveBoards();
  }

  updateColumnTitle(title: string, columnIndex: number, boardIndex: number) {
    this.boards[boardIndex].columns[columnIndex].title = title;
    this.saveBoards();
  }

  deleteColumn(columnIndex: number, boardIndex: number) {
    this.boards[boardIndex].columns.splice(columnIndex, 1);
    this.saveBoards();
  }

  addTask(task: string, columnIndex: number, boardIndex: number) {
    this.boards[boardIndex].columns[columnIndex].tasks.push(task);
    this.saveBoards();
  }

  updateTask(task: string, taskIndex: number, columnIndex: number, boardIndex: number) {
    this.boards[boardIndex].columns[columnIndex].tasks[taskIndex] = task;
    this.saveBoards();
  }

  deleteTask(taskIndex: number, columnIndex: number, boardIndex: number) {
    console.log(this.boards);
    this.boards[boardIndex].columns[columnIndex].tasks.splice(taskIndex, 1);
    this.saveBoards();
  }

  saveBoards(){
    this.cookieService.set('boards', JSON.stringify(this.boards));
    this.loadBoards();
  }
  
  loadBoards(){
    this.boards = JSON.parse(this.cookieService.get('boards'));
  }


}
