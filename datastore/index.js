const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {}; //object which stores the text of each item

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    if (err) {
      throw ('error writing counter');
    } else {
      var idFileName = id + '.txt';
      var todo = {
        id,
        text
      };
      fs.writeFile(path.join(exports.dataDir, idFileName), text, 'utf8', (err) => {
        if (err) {
          throw ('error writing counter');
        } else {
          callback(null, todo);
        }
      });
    }
  });
};

exports.readAll = (callback) => {
  var data = _.map(items, (text, id) => {
    return { id, text };
  });
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw ('error writing counter');
    } else {
      var todoList = files.reduce((allTodos, currentFile) => {
        allTodos.push({ id: currentFile.slice(0, 5), text: currentFile.slice(0, 5) });
        return allTodos;
      }, []);
      callback(null, todoList);
    }
  });
};
//'00001.txt' => { id: '00001', text: '00001' }

exports.readOne = (id, callback) => {
  // var text = items[id];
  // if (!text) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback(null, { id, text });
  // }
  var idFileName = id + '.txt';
  fs.readFile(path.join(exports.dataDir, idFileName), (err, text) => {
    if (err) {
      callback(err, null);
    } else {
      var foundTodo = {
        id,
        text: text.toString()
      };
      callback(null, foundTodo);
    }
  });
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
