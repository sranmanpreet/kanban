import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Column } from '../shared/column.model';

@Component({
  selector: 'app-column-dialog',
  templateUrl: './column-dialog.component.html',
  styleUrls: ['./column-dialog.component.scss']
})
export class ColumnDialogComponent implements OnInit {

  @ViewChild('columnTitle') columnTitle: ElementRef;

  newColumn: boolean;

  constructor(
    public dialogRef: MatDialogRef<ColumnDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Column) { }

  ngOnInit(): void {
    if (this.data.title.length == 0){
      this.newColumn = true;
    } else {
      this.newColumn = false;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
