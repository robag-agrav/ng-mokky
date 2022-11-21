import { Injectable } from '@angular/core';
import { AlmaService } from './alma.service';
import { BarackService } from './barack.service';
import { DioService } from './dio.service';
import { LencseService } from './lencse.service';

@Injectable({
  providedIn: 'root'
})
export class SUTService {

  constructor(
    private alma: AlmaService,
    private dio: DioService,
    private barack: BarackService,
    private lencse: LencseService
  ) { }

  callServices() {
    this.alma.blah();
    this.dio.blah();
    this.barack.blah();
    this.lencse.blah();
  }
}
