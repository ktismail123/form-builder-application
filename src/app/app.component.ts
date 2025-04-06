import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LeftPaneComponent } from './components/left-pane/left-pane.component';
import { MiddlePaneComponent } from './components/middle-pane/middle-pane.component';
import { RightPaneComponent } from './components/right-pane/right-pane.component';
import { RightDrawerComponent } from './components/right-drawer/right-drawer.component';
import { FieldGroupService } from './service/field-group.service';

@Component({
  selector: 'app-root',
  imports: [
    LeftPaneComponent,
    MiddlePaneComponent,
    RightPaneComponent,
    RightDrawerComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  private fgService = inject(FieldGroupService)
  editMode = false;


  title = 'zuper-test';


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
