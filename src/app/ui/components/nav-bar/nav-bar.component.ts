import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { RouterLinkActive, RouterModule } from '@angular/router';
import { NavBarItemComponent } from './nav-bar-item/nav-bar-item.component';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, NavBarItemComponent, RouterLinkActive, RouterModule],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent {
  @Output()
  public navItemSelected = new EventEmitter<string>();

  selected = '';

  onItemClick(item: string) {
    this.selected = item;
    this.navItemSelected.emit(item);
  }
}
