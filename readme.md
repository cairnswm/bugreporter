# Bug Reporter

Javascript library to add a global context menu that a website user can use to report bugs.

## Steps to report bug

1. Open Context Menu (right click/long touch)
1. Bug reported records location of cursor and which element it was on
1. Bug Reporter captures screen show of current page
1. Bug Reporter opens popup modal to ask for details. (Could just use prompt?)
1. Bug Reporter sends page to server with location, element and message

## Additional options that may be considered

Global Exception capture (see window.onerror)

Methods to save screen shot whenever required (eg to track user behaviour)

## Packaging

Normal Javascript package

jQuery add in

React component

## Send onSave or postURL

onSave will recieve an HTML Input and an HTML Canvas as parameters
setting postURL will cause BugReporter to send to that URL

https://stackoverflow.com/questions/13198131/how-to-save-an-html5-canvas-as-an-image-on-a-server