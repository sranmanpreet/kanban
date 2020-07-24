import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Board } from '../shared/board.model';
import { Column } from '../shared/column.model';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { EditService } from '../shared/edit.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { BoardDialogComponent } from '../board-dialog/board-dialog.component';
import { ColumnDialogComponent } from '../column-dialog/column-dialog.component';
import { TaskDialogComponent } from '../task-dialog/task-dialog.component';


@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit, AfterViewInit, OnDestroy {

  editMode: boolean;
  editModeSubscription: Subscription;
  editBoardNameToggle: boolean = false;

  boards: Board[];
  board: Board;
  boardIndex: number;

  constructor(public dialog: MatDialog, private editService: EditService) {
    this.editModeSubscription = this.editService.editModeObserver.subscribe(
      (flag) => {
        this.editMode = flag;
      });
    this.boards = this.editService.boards;
    if(this.boards.length){
      this.loadBoardDetails(0);
    }
  }
  ngAfterViewInit(): void {

  }

  ngOnInit(): void {
  }

  editBoardName() {
    this.editBoardNameToggle = !this.editBoardNameToggle;
  }

  loadBoardDetails(boardIndex) {
    this.board = this.boards[boardIndex];
    this.boardIndex = boardIndex;
  }


  openDialog(boardIndex: number = null): void {
    const ifNewBoard = (boardIndex == null);
    const dialogRef = this.dialog.open(BoardDialogComponent, {
      width: '250px',
      data: ifNewBoard ? new Board("", []) : this.boards[boardIndex]
    });

    dialogRef.afterClosed().subscribe((result: Board) => {
      if (result && result.name && result.name.length > 0) {
        if (ifNewBoard) {
          this.editService.addBoard(result);
          this.loadBoardDetails(this.boards.length - 1);
        } else {
          this.editService.updateBoardName(result.name, boardIndex);
        }
      }
    });
  }

  addColumn() {
    const dialogRef = this.dialog.open(ColumnDialogComponent, {
      width: '250px',
      data: ""
    });

    dialogRef.afterClosed().subscribe((result: string) => {
      console.log(result);
      if (result) {
        this.editService.addColumn(this.boardIndex, result, new Array<string>());
      }
    });
  }

  editColumn(title: string, columnIndex: number) {
    const dialogRef = this.dialog.open(ColumnDialogComponent, {
      width: '250px',
      data: { title: title, columnIndex: columnIndex, boardIndex: this.boardIndex }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.editService.updateColumnTitle(result.title, columnIndex, this.boardIndex);
      }
    });
  }

  deleteColumn(columnIndex: number) {
    this.editService.deleteColumn(columnIndex, this.boardIndex);
  }

  addTask(columnIndex: number) {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '250px',
      data: { task: "", columnIndex: columnIndex, boardIndex: this.boardIndex }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.editService.addTask(result.task, columnIndex, this.boardIndex);
      }
    });
  }

  editTask(task, taskIndex, columnIndex) {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '250px',
      data: { task: task, taskIndex: taskIndex, columnIndex: columnIndex, boardIndex: this.boardIndex }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.editService.updateTask(result.task, taskIndex, columnIndex, this.boardIndex);
      }
    });
  }

  deleteTask(taskIndex: number, columnIndex: number) {
    this.editService.deleteTask(taskIndex, columnIndex, this.boardIndex);
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

  ngOnDestroy(): void {
    this.editModeSubscription.unsubscribe();
  }

}
