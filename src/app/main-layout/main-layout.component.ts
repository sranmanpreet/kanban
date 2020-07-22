import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class MainLayoutComponent implements OnInit, OnDestroy {

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

  ngOnInit(): void {
  }

  animal: string;
  name: string;

  openDialog(): void {
    const dialogRef = this.dialog.open(BoardDialogComponent, {
      width: '250px',
      data: {name: this.name, animal: this.animal}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
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
