import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-kree',
  templateUrl: './kree.component.html',
  styleUrls: ['./kree.component.css']
})
export class KreeComponent implements OnInit {

private beginPledge:boolean;
private doPledge:boolean;

@ViewChild('hand') hand:ElementRef;

  constructor(private el:ElementRef) {

  	this.beginPledge = false;
  	this.doPledge = false;
  }

  ngOnInit() {
  }

  alert(){
  	this.hand.nativeElement.css.top = '-20px';
  }

}
