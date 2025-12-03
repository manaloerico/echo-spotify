import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavBarItemComponent } from './nav-bar-item/nav-bar-item.component';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, NavBarItemComponent],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent {}
