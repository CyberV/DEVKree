import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { NgModule } from '@angular/core';

import { KreeComponent } from './kree.component';
import { ThisMomentComponent } from './this-moment/this-moment.component';
import { QuestionComponent } from './question/question.component';
import { YourNameComponent } from './your-name/your-name.component';
import { PledgeComponent } from './pledge/pledge.component';
import { TypeawayComponent } from './typeaway/typeaway.component';
import { DropBombComponent } from './drop-bomb/drop-bomb.component';
import { TestComponent } from './test/test.component';


@NgModule({
  declarations: [KreeComponent, ThisMomentComponent, QuestionComponent,YourNameComponent, PledgeComponent, TypeawayComponent,
  DropBombComponent, TestComponent],
  imports: [
  BrowserModule,
    FormsModule,
    HttpModule
    
  ],
  
	bootstrap: [
    KreeComponent
  ]
})
export class KreeModule { }
