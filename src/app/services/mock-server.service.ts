import {Injectable} from '@angular/core';

@Injectable()
export class MockServerService {

  FAILURE_COEFF = 10;
  MAX_SERVER_LATENCY = 200;

  constructor() {

  }


  getRandomBool(n) {
    var maxRandomCoeff = 1000;
    if (n > maxRandomCoeff) n = maxRandomCoeff;
    return Math.floor(Math.random() * maxRandomCoeff) % n === 0;
  }

  getSuggestions(text) {
    var pre = 'pre';
    var post = 'post';
    var results = [];
    if (this.getRandomBool(2)) {
      results.push(pre + text);
    }
    if (this.getRandomBool(2)) {
      results.push(text);
    }
    if (this.getRandomBool(2)) {
      results.push(text + post);
    }
    if (this.getRandomBool(2)) {
      results.push(pre + text + post);
    }
    return new Promise((resolve, reject) => {
      var randomTimeout = Math.random() * this.MAX_SERVER_LATENCY;
      setTimeout(() => {
        if (this.getRandomBool(this.FAILURE_COEFF)) {
          reject();
        } else {
          resolve(results);
        }
      }, randomTimeout);
    });
  }

}
