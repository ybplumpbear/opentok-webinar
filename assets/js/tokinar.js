/* global OT */
"use strict";

/**
 * Simple selector interface with caching
 */
var _selector = function () {
  var _cache = {};

  return function _selector_inner (qs) {
    if (_cache[qs]) {
      return _cache[qs];
    }
    _cache[qs] = document.querySelector(qs);
    return _cache[qs];
  };
};

/**
 * Shorthand for selector
 */
var $ = _selector();

/**
 * Create a namespace for Tokinar
 */
var Tokinar = {};

/**
 * Get opentok credentials from document
 *
 * @returns {Object|null} Returns an object or null if no data is found
 */
Tokinar.get_opentok_attrs = function () {
  var webinar = $("#webinar");
  if (webinar === null || !webinar.dataset["opentok"]) {
    return null;
  }
  try {
    return JSON.parse(webinar.dataset.opentok);
  } catch (e) {
    console.log(e);
    return null;
  }
};

/**
 * Initialize an Opentok connection and execute callback
 */
Tokinar.init_connection = function (_attrs, cb) {
  var _session;
  // Test browser capabilities and start session
  if (OT.checkSystemRequirements() === 1) {
    _session = OT.initSession(_attrs.api_key, _attrs.session_id);
    _session.connect(_attrs.token, function (err) {
      if (err) {
        console.log(err);
        // TODO: Show UI message
        return;
      }
      cb(_session);
    });
  } else {
    // Meh, your browser doesn't love WebRTC.
    // TODO: Show better UI message
    alert("Your browser does not support WebRTC.");
  }

};

/**
 * Sets broadcast status on the `#broadcast-status` element.
 *
 * @param {string} status A valid status. One of: "onair", "offline",
 * "paused","ended","error".
 */
Tokinar.set_broadcast_status = function (status) {
  var el = $("#broadcast-status");
  var status_list = {
    onair: "On Air",
    connecting: "Connecting",
    offline: "Offline",
    paused: "Paused",
    ended: "Ended",
    error: "Error"
  };
  if (el !== null && !!status_list[status]) {
    el.className = status;
    el.textContent = status_list[status];
  }
};

/**
 * Create a message handler that writes message to specific DOM
 * element.
 *
 * @param {Object} el The DOM element to print messages in
 *
 * @returns {Function} A closure that prints messages to specified
 * element.
 */
Tokinar.create_message_handler = function (el) {
  var _timeout = null,
      _last_message = null;

  return function message_handler_inner (data, escape) {
    if (_timeout !== null) {
      clearTimeout(_timeout);
    }
    _last_message = data;
    escape = escape | true;
    if (escape) {
      el.textContent = data;
    } else {
      el.innerHTML = data;
    }
    _timeout = setTimeout(function () {
      el.innerHTML = "";
    }, 7500);
  };
};
