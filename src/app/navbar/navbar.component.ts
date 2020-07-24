import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { EditService } from '../shared/edit.service';
import { Subscription } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {

  editMode: boolean;
  private editModeSubscription: Subscription;

  @Output() boardIndex = new EventEmitter<number>();

  constructor(public editService: EditService, private cookieService: CookieService) { 
    this.fetchEditMode();
    this.editModeSubscription = this.editService.editModeObserver.subscribe(
      (flag) => {
        this.editMode = flag;
      });  
  }

  ngOnInit(): void {
 
  }

  fetchEditMode(){
    if(this.cookieService.check('editmode')){
      this.editMode = JSON.parse(this.cookieService.get('editmode'));
      this.editService.editModeObserver.next(this.editMode);
    } else {
      this.editMode = false;
    }
  }

  toggleEditMode(event: Event){
    this.editService.toggleEditMode(event.target['checked']);
  }

  loadBoard(boardIndex: number){
    this.boardIndex.emit(boardIndex);
  }

  ngOnDestroy(): void {
    this.editModeSubscription.unsubscribe();
  }

}
