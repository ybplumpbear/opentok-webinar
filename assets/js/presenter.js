/* global OT, Tokinar, $ */

/**
 * Presenter scripts
 */

(function presenter_handler ($, Tokinar, OT) {
  "use strict";

  var _attrs = Tokinar.get_opentok_attrs(),
      _msg = Tokinar.create_message_handler($("#presenter-msg")),
      _session,
      _publisher;

  var handle_start = function (evt) {
    Tokinar.set_broadcast_status("connecting");
    _msg("Getting user media...");
    _publisher = OT.initPublisher($("#presenter-view"), {
      insertMode: "replace"
    });
    // TODO: Test audio/video before publishing
    _session.publish(_publisher, function (err) {
      if (err) {
        console.log(err);
        _msg("Could not publish your feed.");
        Tokinar.set_broadcast_status("error");
        return;
      }
      $("#pause-btn").removeAttribute("disabled");
      $("#end-btn").removeAttribute("disabled");
      evt.target.setAttribute("disabled", "disabled");
      $("#presenter-view").classList.remove("inactive");
      _msg("You are live.");
      Tokinar.set_broadcast_status("onair");
    });
  };

  var handle_pause = function () {
    // TODO: Handle pausing of broadcast
  };

  var handle_end = function () {
    // TODO: Handle ending broadcast
  };

  var setup_handlers = function (session) {
    _session = session;
    $("#start-btn").removeAttribute("disabled");
    $("#start-btn").addEventListener("click", handle_start);
    $("#pause-btn").addEventListener("click", handle_pause);
    $("#end-btn").addEventListener("click", handle_end);
    _msg("Ready to broadcast. Click \"Start broadcast\" to begin.");
  };

  // Test browser capabilities and start session
  _msg("Setting up...");
  Tokinar.init_connection(_attrs, setup_handlers);

})($, Tokinar, OT);
