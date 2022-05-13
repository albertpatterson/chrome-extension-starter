import { getBookmarkDetails, BookmarkDetail } from './bookmarks';
import { debounce, uniqueId } from 'lodash';

const searchInput = document.getElementById('search-input') as HTMLInputElement;
const pagesOnlyCheckbox = document.getElementById(
  'pages-only-checkbox'
) as HTMLInputElement;

export function drawBookmarkList(bookmarkDetails: BookmarkDetail[]) {
  const bookmarkListContainer = document.getElementById(
    'bookmark-list-container'
  );
  const bookmarkList = document.getElementById('bookmark-list');

  if (bookmarkList) {
    bookmarkListContainer.removeChild(bookmarkList);
  }

  const newBookmarkList = createBookmarkList(bookmarkDetails);

  bookmarkListContainer.appendChild(newBookmarkList);
}

function createBookmarkList(
  bookmarkDetails: BookmarkDetail[]
): HTMLUListElement {
  const bookmarkList: HTMLUListElement = document.createElement('ul');

  for (const bookmarkDetail of bookmarkDetails) {
    const bookmarkItem = createBookmarkItem(bookmarkDetail);
    bookmarkList.appendChild(bookmarkItem);
  }

  bookmarkList.id = 'bookmark-list';

  return bookmarkList;
}

function createBookmarkItem(bookmarkDetail: BookmarkDetail): HTMLLIElement {
  const bookmarkItem: HTMLLIElement = document.createElement('li');
  bookmarkItem.classList.add('bookmark-list-item');

  const anchor: HTMLAnchorElement = document.createElement('a');
  anchor.href = bookmarkDetail.url;
  anchor.target = '_blank';
  anchor.innerText = bookmarkDetail.title || bookmarkDetail.url;
  bookmarkItem.appendChild(anchor);
  return bookmarkItem;
}

export function getSearchInput() {
  return searchInput;
}

export function getPageOnlyCheckbox() {
  return pagesOnlyCheckbox;
}
