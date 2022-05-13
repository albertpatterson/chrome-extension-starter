import '../scss/popup.scss';

import { getBookmarkDetails, BookmarkDetail } from './bookmarks';
import { debounce, uniqueId } from 'lodash';
import { getSearchInput, getPageOnlyCheckbox, drawBookmarkList } from './view';

interface State {
  bookmarkDetails: BookmarkDetail[];
  bookmarkDetailsLoaded: boolean;
  searchValue: string;
  pagesOnly: boolean;
}

let state: State = {
  bookmarkDetails: [],
  bookmarkDetailsLoaded: false,
  searchValue: '',
  pagesOnly: true,
};

type StateListener = (newState: State, oldState: State) => void;

const stateListeners: Map<string, StateListener> = new Map();

function listenState(listener: StateListener) {
  const uuid = uniqueId('state-listener');
  stateListeners.set(uuid, listener);
  return () => stateListeners.delete(uuid);
}

function setState(updatedState: Partial<State>) {
  const oldState = { ...state };
  const newState = { ...state, ...updatedState };
  state = newState;

  for (const listener of Array.from(stateListeners.values())) {
    listener(newState, oldState);
  }
}

function initBookmarkDetailList(details: BookmarkDetail[]) {
  setState({
    bookmarkDetails: details,
    bookmarkDetailsLoaded: true,
  });
}

getBookmarkDetails().then(initBookmarkDetailList);

const searchInput = getSearchInput();
searchInput.addEventListener('input', debounce(handleSearchInput, 200));
function handleSearchInput(e: Event) {
  const searchValue = (e.target as HTMLInputElement).value;
  setState({ searchValue });
}

const pagesOnlyCheckbox = getPageOnlyCheckbox();
pagesOnlyCheckbox.addEventListener(
  'change',
  debounce(handlePageOnlyChecked, 200)
);
function handlePageOnlyChecked(e: Event) {
  const pagesOnly = (e.target as HTMLInputElement).checked;
  setState({ pagesOnly });
}

listenState(updateBookmarkList);
function updateBookmarkList(newState: State, oldState: State) {
  const bookmarkDetailChanged =
    oldState.bookmarkDetails !== newState.bookmarkDetails;
  const searchValueChanged = oldState.searchValue !== newState.searchValue;
  const pagesOnlyChanged = oldState.pagesOnly !== newState.pagesOnly;

  if (!(bookmarkDetailChanged || searchValueChanged || pagesOnlyChanged)) {
    return;
  }

  const { searchValue, bookmarkDetails, pagesOnly } = newState;

  const regExp = new RegExp(searchValue, 'i');
  const matches = bookmarkDetails.filter((detail) => {
    if (pagesOnly && !detail.url.startsWith('http')) {
      return false;
    }
    return detail.title.match(regExp) || detail.url.match(regExp);
  });
  drawBookmarkList(matches);
}
