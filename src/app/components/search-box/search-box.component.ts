import {Component, ElementRef, OnInit, ViewChild, HostListener, Renderer} from '@angular/core';
import {FormControl} from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import {MockServerService} from '../../services';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss']
})
export class SearchBoxComponent implements OnInit {

  searchControl: FormControl;
  autoSuggestions: any = [];
  inputFocused = false;
  previousSearchQuery = '';
  @ViewChild('searchBox') searchBox: ElementRef;
  @ViewChild('suggestionList') suggestionList: ElementRef;

  constructor(private mockServerService: MockServerService,
              private renderer: Renderer) {

  }

  ngOnInit() {
    this.searchControl = new FormControl();
    this.searchControl.valueChanges
      .debounceTime(100)
      .distinctUntilChanged()
      .subscribe((value) => {
        if (value && value.length === 0) {
          this.autoSuggestions = [];
        }
        if (value && (this.inputFocused)) {
          this.getSearchResults(value);
        }
      });
  }

  getSearchResults(searchText: string) {

    if (searchText === this.previousSearchQuery) {
      return;
    }
    searchText = searchText.trim();
    const currentTextBeingTyped = searchText.split(' ').slice(-1);
    this.mockServerService.getSuggestions(currentTextBeingTyped)
      .then((result) => {
        this.autoSuggestions = result;
      }, (error) => {
        console.log(error);
      });
  }

  setValue(value) {
    let currentValue = this.searchControl.value.split(' ');
    currentValue.pop();
    currentValue.push(value + ' ');
    currentValue = currentValue.join(' ');
    this.searchControl.setValue(currentValue);
    this.previousSearchQuery = currentValue;
    this.autoSuggestions = [];
    this.searchBox.nativeElement.focus();
  }

  onBlur() {
    this.inputFocused = false;
  }

  onFocus() {
    this.inputFocused = true;
  }

  clear() {
    this.searchControl.reset();
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    // console.log(event);

    // event.keyCode = 40 ( Keyboard Down)
    const tabOrDown = (event.keyCode === 9) || (event.keyCode === 40);
    if (document.activeElement.id === 'search-box' && tabOrDown && this.suggestionList) {
      this.setFocusOn(this.suggestionList.nativeElement.firstElementChild);
    }

    // event.keyCode = 38 ( Keyboard UP)
    if (document.activeElement.tagName === 'LI' && event.keyCode === 38 && this.suggestionList) {
      this.setFocusOn(document.activeElement.previousElementSibling);
    } else if (document.activeElement.tagName === 'LI' && event.keyCode === 40 && this.suggestionList) {
      this.setFocusOn(document.activeElement.nextElementSibling);
    }
  }

  setFocusOn(element) {
    if (!element) {
      return;
    }
    this.renderer.invokeElementMethod(element, 'focus', []);
  }

}


