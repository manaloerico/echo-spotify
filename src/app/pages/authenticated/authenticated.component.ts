import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  ViewChild,
} from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { NavBarComponent } from 'src/app/ui/components/nav-bar/nav-bar.component';

@Component({
  selector: 'app-authenticated',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavBarComponent],
  templateUrl: './authenticated.component.html',
  styleUrls: ['./authenticated.component.scss'],
})
export class AuthenticatedComponent implements AfterViewInit {
  private router = inject(Router);
  @ViewChild('scrollContainer', { static: true })
  container!: ElementRef<HTMLDivElement>;

  ngAfterViewInit() {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => {
        setTimeout(
          () =>
            this.container.nativeElement.scrollTo({
              top: 0,
              behavior: 'smooth',
            }),
          0
        );
      });
  }
}
