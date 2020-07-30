import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Board } from '../shared/board.model';
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

  board: Board;
  boardIndex: number;

  @ViewChild('addTaskIcon') addTaskIcon: ElementRef;

  constructor(public dialog: MatDialog, private editService: EditService) {
    this.loadBoardDetails(0);
    this.editModeSubscription = this.editService.editModeObserver.subscribe(
      (flag) => {
        this.editMode = flag;
      });
  }
  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
  }

  editBoardName() {
    this.editBoardNameToggle = !this.editBoardNameToggle;
  }

  loadBoardDetails(boardIndex) {
    this.board = this.editService.boards[boardIndex];
    this.boardIndex = boardIndex;
  }


  addBoard(boardIndex: number = null): void {
    const ifNewBoard = (boardIndex == null);
    const dialogRef = this.dialog.open(BoardDialogComponent, {
      width: '250px',
      data: ifNewBoard ? new Board("", []) : this.editService.boards[boardIndex]
    });

    dialogRef.afterClosed().subscribe((result: Board) => {
      if (result && result.name && result.name.length > 0) {
        if (ifNewBoard) {
          this.editService.addBoard(result);
          this.loadBoardDetails(this.editService.boards.length - 1);
        } else {
          this.editService.updateBoardName(result.name, boardIndex);
        }
      }
    });
    this.loadBoardDetails(this.boardIndex);
  }

  deleteBoard() {
    this.editService.deleteBoard(this.boardIndex);
    this.loadBoardDetails((this.boardIndex ? this.boardIndex - 1 : 0));
  }

  addColumn() {
    const dialogRef = this.dialog.open(ColumnDialogComponent, {
      width: '250px',
      data: { title: "" }
    });

    dialogRef.afterClosed().subscribe((result: string) => {
      console.log(result);
      if (result) {
        this.editService.addColumn(this.boardIndex, result, new Array<string>());
      }
    });
    this.loadBoardDetails(this.boardIndex);
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
    this.loadBoardDetails(this.boardIndex);
  }

  deleteColumn(columnIndex: number) {
    this.editService.deleteColumn(columnIndex, this.boardIndex);
    this.loadBoardDetails(this.boardIndex);
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
    this.loadBoardDetails(this.boardIndex);
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
    this.loadBoardDetails(this.boardIndex);
  }

  deleteTask(taskIndex: number, columnIndex: number) {
    this.editService.deleteTask(taskIndex, columnIndex, this.boardIndex);
    this.loadBoardDetails(this.boardIndex);
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
    this.editService.saveBoards();
  }

  ngOnDestroy(): void {
    this.editModeSubscription.unsubscribe();
  }

}
