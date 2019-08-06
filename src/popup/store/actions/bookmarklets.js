function setBookmarklets(bookmarklets = []) {
  return {
    type: 'SET_BOOKMARKLETS',
    payload: bookmarklets
  }
}

export function executeBookmarklet(url) {
  return (dispatch, getState, { browser }) => {
    browser.tabs.executeScript({ code: decodeURIComponent(url) });
  }
}

export function fetchAllBookmarklets() {
  return (dispatch, getState, { browser }) => {
    browser.bookmarks.search({
      query: 'javascript:'
    }, (results) => {
      const filteredResults = results.filter((result) => {
        return result.url.match(/^javascript\:/);
      });

      dispatch(setBookmarklets(filteredResults));
    });
  }
}
