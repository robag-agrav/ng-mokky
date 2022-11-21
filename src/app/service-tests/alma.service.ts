import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlmaService {
  blah() {
    throw new Error('pappada puppi');
  }
}
