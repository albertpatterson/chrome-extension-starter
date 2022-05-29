import { handleRequest } from '../messaging/message';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('received message in tab', request);

  return handleRequest(request, sender, sendResponse);
});
