import { Component, OnInit, OnDestroy } from '@angular/core';
import { EditService } from '../shared/edit.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {

  editMode: boolean = true;
  private editModeSubscription: Subscription;

  constructor(public editService: EditService) { 
    this.editService.editModeObserver.next(this.editMode);
    this.editModeSubscription = this.editService.editModeObserver.subscribe(
      (flag) => {
        this.editMode = flag;
      });  
  }

  ngOnInit(): void {
 
  }

  toggleEditMode(event: Event){
    this.editService.toggleEditMode(event.target['checked']);
  }

  ngOnDestroy(): void {
    this.editModeSubscription.unsubscribe();
  }

}
