import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'this-moment',
  templateUrl: './this-moment.component.html',
  styleUrls: ['./this-moment.component.css']
})
export class ThisMomentComponent implements OnInit {

private firstAnswered:boolean;
private secondAnswered:boolean;
private isMobile:boolean;

private begin;
private paused;
private ready;

@Output() answered = new EventEmitter();

  constructor() {
	this.firstAnswered = false;
	this.secondAnswered = false;
	this.isMobile = false;

  this.begin=false;
  this.paused = false;
  this.ready = false;
  }

  ngOnInit() {
	if(window.innerWidth < 768)
		this.isMobile = true;

  setTimeout(()=>{
    this.begin = true;

    setTimeout(()=>{
    this.paused = true;

    setTimeout(()=>{
    this.ready = true;
  }, 2000);


  }, 2000);

  }, 1500);

  }

  next(){

    let ans = document.getElementsByClassName('a');

    document.getElementsByClassName('q')[0].className += " fadeOut";
    setTimeout(()=>{
      document.getElementsByClassName('q')[1].className += " fadeOut";
      ans[1].style.marginTop='-4em';
      document.getElementsByClassName('q')[2].className += " fadeOut    ";
      setTimeout(()=>{
        ans[2].style.marginTop='-4em';
        setTimeout(()=>{
          this.answered.emit(true);
        },2500)
            
      },2000)
    }, 2000)
    
  }

}
