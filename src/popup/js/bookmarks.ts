export interface BookmarkDetail {
  url: string;
  title: string;
  parents: string[];
}

function flattenBookmarkDetails(
  root: chrome.bookmarks.BookmarkTreeNode,
  parents: string[] = []
): BookmarkDetail[] {
  const searchDetails: BookmarkDetail[] = [];

  const { title, url } = root;

  if (url) {
    const detail: BookmarkDetail = {
      url,
      title,
      parents,
    };
    searchDetails.push(detail);
  }

  if (root.children) {
    for (const child of root.children) {
      const childDetails = flattenBookmarkDetails(child, [...parents, title]);
      searchDetails.push(...childDetails);
    }
  }

  return searchDetails;
}

export function getBookmarkDetails() {
  return chrome.bookmarks
    .getTree()
    .then(([root]) => flattenBookmarkDetails(root, []));
}
