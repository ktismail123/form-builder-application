import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LeftPaneComponent } from './components/left-pane/left-pane.component';
import { MiddlePaneComponent } from './components/middle-pane/middle-pane.component';
import { RightPaneComponent } from './components/right-pane/right-pane.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    LeftPaneComponent,
    MiddlePaneComponent,
    RightPaneComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'zuper-test';
}
