# Server Setup +Mongo +Node +npm:
  $ mongod          #start mongo server *new tab
  $ npm start       #run start tools like webpack *+
  $ node server     #start node server *+
  $ npm run watch   #watch and rebuild js files on edit

# Debug Node server
  1) insert "debugger;" in code
  2) Run node debug myscript.js
  3) Once stopped on a debugger; statement, run "repl" to being inspection
  4) CTRL + C to exit repl and return to debug mode


# Node Debug navigation:
  Stepping____________________
  cont, c - Continue execution
  next, n - Step next
  step, s - Step in
  out, o - Step out
  pause - Pause running code (like pause button in Developer Tools)

  Breakpoints____________________
  setBreakpoint(), sb() - Set breakpoint on current line
  setBreakpoint(line), sb(line) - Set breakpoint on specific line
  setBreakpoint('fn()'), sb(...) - Set breakpoint on a first statement in functions body
  setBreakpoint('script.js', 1), sb(...) - Set breakpoint on first line of script.js
  clearBreakpoint('script.js', 1), cb(...) - Clear breakpoint in script.js on line 1


# +MONGO DB commands:
  https://docs.mongodb.com/manual/reference/mongo-shell/
  help                    Show help.
  db.help()               Show help for database methods.
  db.<collection>.help()  Show help on collection methods.
                          <collection> can be the name of an existing collection or a non-existing collection.
  show dbs                Print a list of all databases on the server.
  use <db>                Switch current database to <db>. The mongo shell variable db is set to the current database.
  show collections        Print a list of all collections for current database
  show users              Print a list of users for current database.
  show roles              Print a list of all roles, both user-defined and built-in, for the current database.
  show profile            Print the five most recent operations that took 1 millisecond or more.
                          See documentation on the database profiler for more information.
  show databases          Print a list of all available databases.

# drop database
  > use mydb;
  > db.dropDatabase();

# drop a collection
  > db.<collection>.drop()


# get collection keys:
  Object.keys(db.<collection>.findOne())

# commands to run on collections
db.<collection>.find().help()   - show DBCursor help
db.<collection>.bulkWrite( operations, <optional params> ) - bulk execute write operations, optional parameters are: w, wtimeout, j
db.<collection>.count( query = {}, <optional params> ) - count the number of documents that matches the query, optional parameters are: limit, skip, hint, maxTimeMS
db.<collection>.copyTo(newColl)   - duplicates collection by copying all documents to newColl; no indexes are copied.
db.<collection>.convertToCapped(maxBytes) - calls {convertToCapped:'<collection>', size:maxBytes}} command
db.<collection>.createIndex(keypattern[,options])
db.<collection>.createIndexes([keypatterns], <options>)
db.<collection>.dataSize()
db.<collection>.deleteOne( filter, <optional params> ) - delete first matching document, optional parameters are: w, wtimeout, j
db.<collection>.deleteMany( filter, <optional params> ) - delete all matching documents, optional parameters are: w, wtimeout, j
db.<collection>.distinct( key, query, <optional params> ) - e.g. db.<collection>.distinct( 'x' ), optional parameters are: maxTimeMS
db.<collection>.drop() drop the collection
db.<collection>.dropIndex(index) - e.g. db.<collection>.dropIndex( "indexName" ) or db.<collection>.dropIndex( { "indexKey" : 1 } )
db.<collection>.dropIndexes()
db.<collection>.ensureIndex(keypattern[,options]) - DEPRECATED, use createIndex() instead
db.<collection>.explain().help() - show explain help
db.<collection>.reIndex()
db.<collection>.find([query],[fields]) - query is an optional query filter. fields is optional set of fields to return.
                                              e.g. db.<collection>.find( {x:77} , {name:1, x:1} )
db.<collection>.find(...).count()
db.<collection>.find(...).limit(n)
db.<collection>.find(...).skip(n)
db.<collection>.find(...).sort(...)
db.<collection>.findOne([query], [fields], [options], [readConcern])
db.<collection>.findOneAndDelete( filter, <optional params> ) - delete first matching document, optional parameters are: projection, sort, maxTimeMS
db.<collection>.findOneAndReplace( filter, replacement, <optional params> ) - replace first matching document, optional parameters are: projection, sort, maxTimeMS, upsert, returnNewDocument
db.<collection>.findOneAndUpdate( filter, update, <optional params> ) - update first matching document, optional parameters are: projection, sort, maxTimeMS, upsert, returnNewDocument
db.<collection>.getDB() get DB object associated with collection
db.<collection>.getPlanCache() get query plan cache associated with collection
db.<collection>.getIndexes()
db.<collection>.group( { key : ..., initial: ..., reduce : ...[, cond: ...] } )
db.<collection>.insert(obj)
db.<collection>.insertOne( obj, <optional params> ) - insert a document, optional parameters are: w, wtimeout, j
db.<collection>.insertMany( [objects], <optional params> ) - insert multiple documents, optional parameters are: w, wtimeout, j
db.<collection>.mapReduce( mapFunction , reduceFunction , <optional params> )
db.<collection>.aggregate( [pipeline], <optional params> ) - performs an aggregation on a collection; returns a cursor
db.<collection>.remove(query)
db.<collection>.replaceOne( filter, replacement, <optional params> ) - replace the first matching document, optional parameters are: upsert, w, wtimeout, j
db.<collection>.renameCollection( newName , <dropTarget> ) renames the collection.
db.<collection>.runCommand( name , <options> ) runs a db command with the given name where the first param is the collection name
db.<collection>.save(obj)
db.<collection>.stats({scale: N, indexDetails: true/false, indexDetailsKey: <index key>, indexDetailsName: <index name>})
db.<collection>.storageSize() - includes free space allocated to this collection
db.<collection>.totalIndexSize() - size in bytes of all the indexes
db.<collection>.totalSize() - storage allocated for all data and indexes
db.<collection>.update( query, object[, upsert_bool, multi_bool] ) - instead of two flags, you can pass an object with fields: upsert, multi
db.<collection>.updateOne( filter, update, <optional params> ) - update the first matching document, optional parameters are: upsert, w, wtimeout, j
db.<collection>.updateMany( filter, update, <optional params> ) - update all matching documents, optional parameters are: upsert, w, wtimeout, j
db.<collection>.validate( <full> ) - SLOW
db.<collection>.getShardVersion() - only for use with sharding
db.<collection>.getShardDistribution() - prints statistics about data distribution in the cluster
db.<collection>.getSplitKeysForChunks( <maxChunkSize> ) - calculates split points over all chunks and returns splitter function
db.<collection>.getWriteConcern() - returns the write concern used for any operations on this collection, inherited from server/db if set
db.<collection>.setWriteConcern( <write concern doc> ) - sets the write concern for writes to the collection
db.<collection>.unsetWriteConcern( <write concern doc> ) - unsets the write concern for writes to the collection




*Origami plugin: [hjkl for directions]
Travel:  cmd+, [dir]
Create:  cmd+, cmd+[dir]
Carry:   cmd+, opt+[dir]
Clone:   cmd+, opt+shift+[dir]
Destroy: cmd+, cmd+shift+[dir]
Zoom:    cmd+, cmd+z (cmd+shift+z to unzoom)
Resize:  cmd+, cmd+c (cmd+r for rows, c for cols)