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


  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw ('error writing counter');
    } else {
      var allTodos = [];
      files.map((currentFile) => {
        //read the text of this file
        return new Promise((resolve, reject) => {
          return fs.readFile(path.join(exports.dataDir, currentFile), (err, text) => {
            if (err) {
              reject(err);
            } else {
              allTodos.push({
                id: currentFile.slice(0, 5),
                text
              });
            }
          });
        });
      });
    }
    Promise.all(allTodos).then((todo) => {
      //call callback on allTodos
      callback(null, allTodos);
    });
  });

};

// Promise.map(fileNames, function(fileName) {
//   // Promise.map awaits for returned promises as well.
//   return fs.readFileAsync(fileName);
// }).then(function() {
//   console.log("done");
// });

// var files = [];
// for (var i = 0; i < 100; ++i) {
//     files.push(fs.writeFileAsync("file-" + i + ".txt", "", "utf-8"));
// }
// Promise.all(files).then(function() {
//     console.log("all the files were created");
// });

exports.readOne = (id, callback) => {
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
  var idFileName = id + '.txt';
  fs.readFile(path.join(exports.dataDir, idFileName), ((readErr, readText) => {
    if (readErr) {
      callback(readErr, null);
    } else {
      fs.writeFile(path.join(exports.dataDir, idFileName), text, ((writeErr) => {
        if (writeErr) {
          callback(writeErr, null);
        } else {
          callback(null, { id, text });
        }
      }));
    }
  }));
};

exports.delete = (id, callback) => {
  var idFileName = id + '.txt';
  fs.rm(path.join(exports.dataDir, idFileName), ((err) => {
    if (err) {
      callback(err);
    } else {
      callback(null);
    }
  }));
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
