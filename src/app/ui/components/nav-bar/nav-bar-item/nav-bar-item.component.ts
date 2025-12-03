import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-nav-bar-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nav-bar-item.component.html',
  styleUrls: ['./nav-bar-item.component.scss'],
})
export class NavBarItemComponent {
  @Output()
  public onItemClick = new EventEmitter<string>();
  @Input() label: string = '';

  @HostBinding('class.nav__item--active')
  @Input()
  isActive: boolean = false;

  @HostListener('click')
  onClick() {
    this.isActive = !this.isActive;
    this.onItemClick.emit(this.label);
  }
}
