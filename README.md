# Orchestrate Client for Node-RED

![Node-RED and Orchestrate](http://i.imgur.com/lgDAL9H.jpg)

A [Node-RED](http://nodered.org) wrapper for the [Orchestrate](http://orchestrate.io) database as a service API. There are both input and output nodes included for interacting with the Orchestrate REST API.

## What is this? Where am I?

Calm down, you're safe here. I'll explain everything.

#### What's Node-RED?

From Node-RED's own [web page](http://nodered.org):

> Node-RED is a tool for wiring together hardware devices, APIs and online services in new and interesting ways.

#### What's Orchestrate?

From Orchestrate's own [web page](http://orchestrate.io):

> Orchestrate unifies multiple databases through a simple REST API. It runs as a service (you store your data with [them]!) and supports queries like full-text search, events, graph, and key/value.

#### Thanks, I feel so much better now

You're welcome.

## Installation

Run this command in the root directory of your Node-RED installation:

```
npm install node-red-contrib-orchestrate
```

Note that this will also install the nodes' sole dependency - [orchestrate.js](https://github.com/orchestrate-io/orchestrate.js).

## Usage

Once installed (and after restarting Node-RED and refreshing its page in your browser), you'll see some rather attractively-coloured nodes labelled "orchestrate" in your node locker under the 'storage' section.

The node with both an input and an output is (confusingly) our input node. This node allows you to get information from your orchestrate database.

The node with only an input is our output node. This allows you to send information to your orchestrate database and save it there.

When you drag either node to your workspace, you'll need to open its options and either add an orchestrate application (if you haven't already), or select one. Adding an application is as simple as pasting in the API token you can get from your application's dashboard on the Orchestrate site.

For both the input and output nodes you can specify a collection to send the information to in their node options.

Both nodes take their information from a <code>msg</code> object passed to them. **Below are the specs for each node's msg inputs**. Note that these are also visible if you select a node in Node-RED and view the info tab on the right of the screen.

#### Ouput node msg object

- <code>msg.collection</code> *(semi-optional)*: Specify which collection to push the data to (this will override the option entered in the node config window if set, allowing you to use one output node to send to multiple collections). Note that collection must be set either in the node options or in this property.
- <code>msg.data</code> *(required)*: The JS data object you want to send to your collection.
- <code>msg.key</code> *(optional)*: Give the data a key. If absent, orchestrate will apply its own.
- <code>msg.match</code> *(optional)*: Update if the value of this matches a currently stored ref, or assign as false to create only if no match found.

#### Input node msg object

- <code>msg.collection</code> *(optional)*: Specify which collection to push the data to (this will override the option entered in the node config window if set, allowing you to use one output node to send to multiple collections).
- <code>msg.key</code> *(optional)*: Get based on a key. This will supercede a query if present.
- <code>msg.query</code> *(optional)*: A lucene search query string.
- <code>msg.queryOptions</code> *(required if using msg.query)*: An object with options that apply modifiers to your query results, e.g.

```
{ sort: 'temp.sort:desc', limit: 5, offset: 2 }
```

## Features

Currently, the output node provides support for:

* Puts (with collection, key and data).
* Conditional puts (with collection, key, data and matching logic).
* Posts (with collection).
* One output node can provide access to multiple collections within an application's database through use of object properties passed to it that override options set on the node.

The input node provides support for:

* Gets (with collection and key).
* Queries (with collection, lucene query, and query options).
* Again, one node can interface with multiple collections, allowing for nice node reuse in a flow.

For more on these features and how they work in Orchestrate, check out their [docs](https://orchestrate.io/docs).

## Future plans

TAKE OVER THE- Oh, you mean with this node? Ah. Awkward.

* Gets with ref - seemed redundant until we have something with...
* Collection Listing
* Graphing
* Events
