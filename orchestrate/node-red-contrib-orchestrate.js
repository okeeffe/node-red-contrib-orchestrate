module.exports = function(RED) {
  'use strict';
  var db = require('orchestrate');

  function OrchestrateNode(config) {
    RED.nodes.createNode(this, config);
    this.token = this.credentials.token;
  }
  RED.nodes.registerType("orchestrate", OrchestrateNode,
    {
      credentials: { token: { type: "text" }
    }
  });

  function OrchestrateOutNode(config) {
    RED.nodes.createNode(this, config);
    this.collection = config.collection;
    this.orchestrateConfig = RED.nodes.getNode(config.application);

    if(this.orchestrateConfig) {
      var node = this;
      //use the token to connect to the correct database
      var nodeDb = db(node.orchestrateConfig.token);

      node.on('input', function(msg) {
        // if a collection was specified
        if(msg.collection || node.collection) {
          var collection = msg.collection || node.collection;
          // if a key was specified
          if(msg.key) {
            // if a ref was provided
            if(msg.match) {
              nodeDb.put(collection, msg.key, msg.data, msg.match)
              .then(function(result) {
                node.status({fill:"green",shape:"dot",text:"success"});
              })
              .fail(function(err) {
                node.status({fill:"red",shape:"dot",text:"failure"});
                node.error(err);
              });
            }
            // no match but specified key
            else {
              nodeDb.put(collection, msg.key, msg.data)
              .then(function(result) {
                node.status({fill:"green",shape:"dot",text:"success"});
              })
              .fail(function(err) {
                node.status({fill:"red",shape:"dot",text:"failure"});
                node.error(err);
              });
            }
          }
          // else get orchestrate to produce a key
          else {
            nodeDb.post(collection, msg.data)
            .then(function(result) {
              node.status({fill:"green",shape:"dot",text:"success"});
            })
            .fail(function(err) {
              node.status({fill:"red",shape:"dot",text:"failure"});
              node.error(err);
            });
          }
        }
        // no collection referenced
        else {
          node.status({fill:"red",shape:"dot",text:"failure"});
          node.error('No collection specified in node options or incoming msg object.');
        }
      });
    }
  }
  RED.nodes.registerType("orchestrate out", OrchestrateOutNode);

  function OrchestrateInNode(config) {
    RED.nodes.createNode(this, config);
    this.collection = config.collection;
    this.orchestrateConfig = RED.nodes.getNode(config.application);

    if(this.orchestrateConfig) {
      var node = this;
      //use the token to connect to the correct database
      var nodeDb = db(node.orchestrateConfig.token);

      node.on('input', function(msg) {
        // if a collection was specified
        if(msg.collection || node.collection) {
          var collection = msg.collection || node.collection;
          // if a key was specified it's a straight get
          if(msg.key) {
            nodeDb.get(collection, msg.key)
            .then(function(result) {
              node.status({fill:"green",shape:"dot",text:"success"});
              var msg = { payload: result.body };
              node.send(msg);
            })
            .fail(function(err) {
              node.status({fill:"red",shape:"dot",text:"failure"});
              node.error(err);
            });
          }
          // else it might be a search
          else if(msg.query && msg.queryOptions) {
            nodeDb.search(collection, msg.query, msg.queryOptions)
            .then(function (result) {
              node.status({fill:"green",shape:"dot",text:"success"});
              var msg = { payload: result.body };
              node.send(msg);
            })
            .fail(function (err) {
              node.status({fill:"red",shape:"dot",text:"failure"});
              node.error(err);
            });
          }
          else if(msg.query && !msg.queryOptions) {
            node.status({fill:"red",shape:"dot",text:"failure"});
            node.error('No queryOptions passed in msg object to accompany the msg.query.');
          }
          else if(msg.queryOptions && msg.query) {
            node.status({fill:"red",shape:"dot",text:"failure"});
            node.error('No query passed in msg object to accompany the msg.queryOptions.');
          }
        }
        // no collection referenced
        else {
          node.status({fill:"red",shape:"dot",text:"failure"});
          node.error('No collection specified in node options or incoming msg object.');
        }
      });
    }
  }
  RED.nodes.registerType("orchestrate in", OrchestrateInNode);
};
