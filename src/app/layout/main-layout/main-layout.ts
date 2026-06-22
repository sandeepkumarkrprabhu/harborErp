import { Component, Input } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../../shared/components/sidebar/sidebar';
import { SearchIcon } from 'lucide-angular';
import { InputField } from '../../shared/components/input-field/input-field';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, InputField, Sidebar],
  templateUrl: './main-layout.html'
})
export class MainLayout {

  readonly SearchIcon = SearchIcon;

  @Input() pageTitle: string = 'Overview';
}