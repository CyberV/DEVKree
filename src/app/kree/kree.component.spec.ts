/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { KreeComponent } from './kree.component';

describe('KreeComponent', () => {
  let component: KreeComponent;
  let fixture: ComponentFixture<KreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
