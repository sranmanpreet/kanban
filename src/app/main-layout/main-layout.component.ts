import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Board } from '../shared/board.model';
import { Column } from '../shared/column.model';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { EditService } from '../shared/edit.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { BoardDialogComponent } from '../board-dialog/board-dialog.component';


@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit, AfterViewInit, OnDestroy {

  editMode: boolean;
  editModeSubscription: Subscription;

  boards: Board[];

  constructor(public dialog: MatDialog, private editService: EditService) {
    this.editModeSubscription = this.editService.editModeObserver.subscribe(
      (flag) => {
        this.editMode = flag;
      });
    this.boards = this.editService.boards;
  }
  ngAfterViewInit(): void {
    
  }
  
  ngOnInit(): void {
  }


  openDialog(boardIndex: number): void {
    const ifNewBoard = (boardIndex == null);
    console.log(boardIndex);
    const dialogRef = this.dialog.open(BoardDialogComponent, {
      width: '250px',
      data: ifNewBoard? new Board("", []): this.boards[boardIndex]
    });

    dialogRef.afterClosed().subscribe((result: Board) => {
      console.log(result);
      if(result && result.name && result.name.length > 0){
        if(ifNewBoard){
          this.editService.addBoard(result);
        } else {
          this.editService.updateBoardName(result.name, boardIndex);
        }
      }
    });
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
