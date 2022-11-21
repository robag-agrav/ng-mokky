import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BarackService {
  blah() {
    throw new Error('pappada puppi');
  }
}
