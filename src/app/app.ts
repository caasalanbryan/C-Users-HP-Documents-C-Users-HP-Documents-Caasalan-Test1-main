import { Component, signal } from '@angular/core';
import { Products } from './products/products';

@Component({
  selector: 'app-root',
  imports: [Products],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('Test1');
}
