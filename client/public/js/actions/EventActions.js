/**
 * This is an action creator, which is a collection of methods that are called to send actions to the dispatcher.
 * This is the action creator for events that defines all the possible actions for modifying events.
 */

var AppDispatcher = require('../dispatcher/AppDispatcher'),
    AppConstants = require('../constants/AppConstants');

var EventActions = {
  // Creates an event
  create: function(name) {
    AppDispatcher.dispatch({
      actionType: AppConstants.EVENT_CREATE,
      name: name
    });
  },

  // Deletes an event
  destroy: function(id) {
    AppDispatcher.dispatch({
      actionType: AppConstants.EVENT_DELETE,
      id: id
    });
  }
};

module.exports = EventActions;