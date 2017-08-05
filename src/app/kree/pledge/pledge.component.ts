import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'pledge',
  templateUrl: './pledge.component.html',
  styleUrls: ['./pledge.component.scss']
})
export class PledgeComponent implements OnInit {
@Input() q:string;
@Input() answer:string;
@Output() answered = new EventEmitter();
private label:string;

private startInterval:number = 1000;
private promptInterval:number = 3000;
private exitInterval:number= 1000;
private typeInterval:number = 100;
private markInterval:number = 500;
private markCounter:number;
private markMax:number;
private hasAnswered:boolean;
private hasName:boolean;

private prompt:boolean;
private showAnswer:boolean;

  constructor() {
  }

  ngOnInit() {
	console.log(this.q);
	
	this.label = "";
	this.markCounter = 0;
	this.markMax = 3;
	this.showAnswer = false;
	this.hasAnswered = false;
	this.prompt = false;
	this.hasName = false;
	
	setTimeout(()=>{
		this.showNextChar();
	}, this.startInterval);
	
  }
  
  toggleQuestionMark(){
	if(this.label.charAt(this.label.length -1) == '?')
	{
		this.label = this.label.substring(0,this.label.length -1);
		setTimeout(()=>{
				this.toggleQuestionMark();
			}, this.markInterval);
	}
	else{
		this.label += '?';
		this.markCounter++;
		if(this.markCounter < this.markMax)
		{	
			setTimeout(()=>{
				this.toggleQuestionMark();
			}, this.markInterval);
		}
		else{
			this.showAnswer = true;

			setTimeout(()=>{
				this.prompt = true;
				setTimeout(()=>{
					this.onClick();
				},1500);
			}, this.promptInterval);
		}
		
	}
  }

  onClick(){
  	this.answered.emit(true);
			this.hasAnswered = true;
  }
  
  showNextChar(){
  	if(!this.label)
  		return;
	  if(this.label.length != this.q.length)
	  {
		this.label = this.q.substring(0,this.label.length + 1);
		setTimeout(()=>{
		this.showNextChar();
	  }, this.typeInterval);
	  }
	  else{
		this.toggleQuestionMark();
	  }
	  

  
  }

}
