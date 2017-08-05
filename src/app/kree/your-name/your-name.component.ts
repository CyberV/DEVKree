import { Component, OnInit, Input, Output, EventEmitter, ElementRef } from '@angular/core';

@Component({
  selector: 'your-name',
  templateUrl: './your-name.component.html',
  styleUrls: ['./your-name.component.scss']
})
export class YourNameComponent implements OnInit {

@Output() answered = new EventEmitter();
private name:string;
private placeholder:string;
private meText:string;
private mes:string[];
private currentMe:number;
private entering;
private exiting;

private hasName:boolean;

private showInterval:number= 1000;
private exitInterval:number= 1000;
private checkInterval:number = 1000;
private inputVisible:boolean;
private hasAnswered:boolean;
private now:Date;
private then:Date;

private inputWidth:number;

private tmp;
  constructor(private el:ElementRef) {
  }

  ngOnInit() {
  	this.inputVisible = false;
  	this.name="";
  	this.placeholder="Full Name";
	this.hasAnswered = false;
  this.meText = "";
  this.mes = [ 'I',  'मैं',  'ਮੈਨੂੰ',  'ನಾನು', ' میں '];
  //this.mes = [ 'I'];
  this.currentMe = -1;

  this.inputWidth = 0;

  this.entering=false;
  this.exiting = false;
  this.hasName = false;
	

	let clear1 = setInterval(()=>{
this.nextMeText();

  clearInterval(clear1);
	}, 500);
	
  }

  nextMeText(){
    if(this.currentMe < this.mes.length -1)
    {
      
      this.exiting = false;
      this.entering = true;
      
      this.meText = this.mes[++this.currentMe];
      let clear2 =setInterval(()=>{
        
        this.entering=false;
        this.exiting = true;
        clearInterval(clear2);
        let clear3 = setInterval(()=>{
          
          clearInterval(clear3);
          this.nextMeText() ;
        }, this.showInterval);
      },this.showInterval);
    }
    else{
      this.inputVisible = true;
      setTimeout(()=>{
        this.inputWidth = 300;
        setTimeout(()=>{
         this.el.nativeElement.getElementsByClassName('yourName')[0].click();
       },1000);
      }, 500)
     
    }
  }

  checkName(key){

  console.log(this.name);
  

  let clear1 = setInterval(()=>{
    if(this.tmp == this.name)
    {
      
      this.moveOn();
    }
    else{
      this.tmp = this.name;
    }
    clearInterval(clear1);
  }, 3000)
  }

  moveOn(){
    this.hasName= true;
    console.log('hasName', this.hasName);
    this.answered.emit();
  }
   
  showInput(){

  }

}
