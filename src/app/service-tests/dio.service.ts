import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DioService {
  blah() {
    throw new Error('pappada puppi');
  }
}
