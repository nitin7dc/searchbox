/***********************************************************************************************************************
 * Search Box Component : Controller.

 Events Handled

 - When user in entering text inside search input box.
 - on focus/blur event : show/hide auto suggestions list.
 - on 'keydown' event :
      tab/down key > first element from auto suggestion list is focused.
      up /down key > previous/next element from auto suggestion list is focused.
      enter key > if active element is a list item of auto suggestion list, value will be added to input box.
 ***********************************************************************************************************************/

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
  loading = false;
  @ViewChild('searchBox') searchBox: ElementRef;
  @ViewChild('suggestionList') suggestionList: ElementRef;

  constructor(private mockServerService: MockServerService,
              private renderer: Renderer) {
  }

  ngOnInit() {
    this.searchControl = new FormControl();
    this.searchControl.valueChanges
      .debounceTime(200)
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


  /**
   * Get auto suggestions for current user input.
   * @param {string} searchText
   */
  getSearchResults(searchText: string) {
    if (searchText === this.previousSearchQuery) {
      return;
    }
    searchText = searchText.trim();
    const currentTextBeingTyped = searchText.split(' ').slice(-1);
    this.loading = true;
    this.mockServerService.getSuggestions(currentTextBeingTyped)
      .then((result) => {
        this.autoSuggestions = result;
        this.loading = false;
      }, (error) => {
        console.log(error);
        this.loading = false;
      });
  }


  /**
   * Select value from auto suggestion list.
   * Add this to current search input.
   *
   * @param value
   */
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


  /**
   * On Blur event, on change of focus.
   * This will help give auto suggestions.
   */
  onBlur() {
    this.inputFocused = false;
  }


  /**
   * On Focus event, on change of focus.
   * This will help give auto suggestions.
   */
  onFocus() {
    this.inputFocused = true;
  }


  /**
   * Reset search control.
   */
  clear() {
    this.searchControl.reset();
  }

  /**
   * Hide auto suggestions on click outside.
   */
  hideSuggestions(){
    this.autoSuggestions = [];
    console.log('hide auto suggestions.');
  }

  /********************************************************************************************************************
   * Keyboard Events : Handle standard keyboard events.
   *
   * event.keyCode = 9 ( Tab Key)
   * event.keyCode = 40 ( Down Key)
   * event.keyCode = 40 ( Up Key)
   * event.keyCode = 13 (Enter Key)
   ********************************************************************************************************************/

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    // console.log(event);
    const activeElement: any = document.activeElement;
    const tabOrDown = (event.keyCode === 9) || (event.keyCode === 40);
    if (activeElement.id === 'search-box' && tabOrDown && this.suggestionList) {
      this.setFocusOn(this.suggestionList.nativeElement.firstElementChild);
    } else if (activeElement.tagName === 'LI' && event.keyCode === 38) {
      this.setFocusOn(activeElement.previousElementSibling);
    } else if (activeElement.tagName === 'LI' && event.keyCode === 40) {
      this.setFocusOn(activeElement.nextElementSibling);
    } else if (activeElement.tagName === 'LI' && event.keyCode === 13) {
      this.setValue(activeElement.innerText);
    }

  }

  /**
   * Set focus on element.
   * @param element
   */
  setFocusOn(element) {
    if (!element) {
      return;
    }
    this.renderer.invokeElementMethod(element, 'focus', []);
  }

}


