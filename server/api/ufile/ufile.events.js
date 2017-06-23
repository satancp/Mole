/**
 * Ufile model events
 */

'use strict';

import {EventEmitter} from 'events';
var UfileEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
UfileEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Ufile) {
  for(var e in events) {
    let event = events[e];
    Ufile.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    UfileEvents.emit(`${event}:${doc._id}`, doc);
    UfileEvents.emit(event, doc);
  };
}

export {registerEvents};
export default UfileEvents;
