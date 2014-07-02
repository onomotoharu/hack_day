var WebSocketIO = function(url, opts){
  new EventEmitter().apply(this);
  if(typeof opts === "undefined" || opts === null) opts = {};
  this.url = url || "ws://localhost:9000";
  this.session = opts.session || null;
  this.websocket = null;
  this.connecting = false;
  var reconnect_timer_id = null;
  var running = false;
  var self = this;

  self.on("__session_id", function(session_id){
    self.session = session_id;
    self.emit("connect", self.session);
  });

  this.connect = function(){
    if(typeof WebSocket === "undefined"){
      self.emit("error", "websocket not exists in this browser");
      return null;
    }
    self.running = true;
    var url = self.session ? self.url+"/session="+self.session : self.url;
    self.websocket = new WebSocket(url);
    self.websocket.onmessage = function(e){
      var data_ = null;
      try{
        data_ = JSON.parse(e.data);
      }
      catch(e){
        self.emit("error", "WebSocketIO data parse error");
      }
      if(!!data_) self.emit(data_.type, data_.data);
    };
    self.websocket.onclose = function(){
      if(self.connecting){
        self.connecting = false;
        self.emit("disconnect");
      }
      if(self.running){
        reconnect_timer_id = setTimeout(self.connect, 10000);
      }
    };
    self.websocket.onopen = function(){
      self.connecting = true;
    };
    return self;
  };

  this.close = function(){
    clearTimeout(reconnect_timer_id);
    self.running = false;
    self.websocket.close();
  };

  this.push = function(type, data){
    if(!self.connecting){
      self.emit("error", "websocket not connected");
      return;
    }
    self.websocket.send(JSON.stringify({type: type, data: data, session: self.session}));
  };
};
// event_emitter.js v0.0.8
// https://github.com/shokai/event_emitter.js
// (c) 2013 Sho Hashimoto <hashimoto@shokai.org>
// The MIT License
var EventEmitter = function(){
  var self = this;
  this.apply = function(target, prefix){
    if(!prefix) prefix = "";
    for(var func in self){
      if(self.hasOwnProperty(func) && func !== "apply"){
        target[prefix+func] = this[func];
      }
    }
  };
  this.__events = new Array();
  this.on = function(type, listener, opts){
    if(typeof listener !== "function") return;
    var event_id = self.__events.length > 0 ? 1 + self.__events[self.__events.length-1].id : 0
    var params = {
      id: event_id,
      type: type,
      listener: listener
    };
    for(i in opts){
      if(!params[i]) params[i] = opts[i];
    };
    self.__events.push(params);
    return event_id;
  };

  this.once = function(type, listener){
    self.on(type, listener, {once: true});
  };

  this.emit = function(type, data){
    for(var i = 0; i < self.__events.length; i++){
      var e = self.__events[i];
      switch(e.type){
      case type:
        e.listener(data);
        if(e.once) e.type = null;
        break
      case "*":
        e.listener(type, data);
        if(e.once) e.type = null;
        break
      }
    }
    self.removeListener();
  };

  this.removeListener = function(id_or_type){
    for(var i = self.__events.length-1; i >= 0; i--){
      var e = self.__events[i];
      switch(typeof id_or_type){
      case "number":
        if(e.id === id_or_type) self.__events.splice(i,1);
        break
      case "string":
      case "object":
        if(e.type === id_or_type) self.__events.splice(i,1);
        break
      }
    }
  };

};

if(typeof module !== "undefined" && typeof module.exports !== "undefined"){
  module.exports = EventEmitter;
}
