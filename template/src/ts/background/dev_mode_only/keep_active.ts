chrome.alarms.create({ delayInMinutes: 0.5, periodInMinutes: 0.5 });

chrome.alarms.onAlarm.addListener(() => {
  console.log('alarm fired.');
});
