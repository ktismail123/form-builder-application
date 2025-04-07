import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { LeftPaneComponent } from '../left-pane/left-pane.component';
import { MiddlePaneComponent } from '../middle-pane/middle-pane.component';
import { RightPaneComponent } from '../right-pane/right-pane.component';
import { RightDrawerComponent } from '../right-drawer/right-drawer.component';
import { FieldGroupService } from '../../service/field-group.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    LeftPaneComponent,
    MiddlePaneComponent,
    RightPaneComponent,
    RightDrawerComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  private fgService = inject(FieldGroupService);

  editMode = false;
  private subscription: Subscription | null = null;

  ngOnInit(): void {
    this.subscription = this.fgService.clickedForEdit$.subscribe((res: boolean) => {
      this.editMode = res;
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
