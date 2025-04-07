import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { HomeComponent } from './components/home/home.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

export const routes: Routes = [
    {
        path: '', redirectTo: 'landing', pathMatch: 'full',
    },
    {
        path: 'landing', component: LandingComponent
    },
    {
        path: 'home', component: HomeComponent
    },
    {
        path: '**', component: PageNotFoundComponent
    }
];
