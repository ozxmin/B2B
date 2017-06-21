import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'connectedb2b';
  date = new Date();
  year = this.date.getFullYear();
  flagRecover = false;
  flagContent = false;
  RecoverFlag(flag){
    this.flagRecover = flag;
    console.log(flag);
  }
  ContentFlag(flag){
    this.flagContent = flag;
    console.log(flag+'Content');
  }
}
