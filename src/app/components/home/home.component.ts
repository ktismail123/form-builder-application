import { Component, inject, OnInit } from '@angular/core';
import { LeftPaneComponent } from '../left-pane/left-pane.component';
import { MiddlePaneComponent } from '../middle-pane/middle-pane.component';
import { RightPaneComponent } from '../right-pane/right-pane.component';
import { RightDrawerComponent } from '../right-drawer/right-drawer.component';
import { FieldGroupService } from '../../service/field-group.service';

@Component({
  selector: 'app-home',
  imports: [
    LeftPaneComponent,
    MiddlePaneComponent,
    RightPaneComponent,
    RightDrawerComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  private fgService = inject(FieldGroupService)
  editMode = false;

  ngOnInit(): void {
      this.fgService.clickedForEdit$.subscribe(res => {
        if(res){
          console.log(res);
          
          this.editMode = true;
        }else{
          this.editMode = false
        }
      })
  }

}
