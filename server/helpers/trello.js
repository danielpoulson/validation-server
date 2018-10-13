const request = require("request");
const tasks = require("../controllers/tasks")
const config = require("../config/config")
const api = config.trello.API_KEY;
const token = config.trello.TOKEN;

exports.addTrello = function(task) {
  const options = {
    method: "POST",
    url: `https://api.trello.com/1/cards?key=${api}&token=${token}`,
    qs: {
      name: task.name,
      pos: "top",
      due: task.due,
      idList: "5a09fb675e9f0abca1577120",
      idLabels: "5a09fb679ae3d60b0cbdf472",
      keepFromSource: "all"
    }
  };


  return request(options, function(error, response, body) {
    if (error) throw new Error(error);
    const trello = JSON.parse(body);
    const data = { trelloId: trello.id };
    tasks.updateTaskById(task.id, data);
  });
}

exports.removeTrello = (id, taskId) => {
  const options = {
    method: "DELETE",
    url: `https://api.trello.com/1/cards/${id}?key=${api}&token=${token}`
  };

  request(options, function(error, response, body) {
    if (error) throw new Error(error);
    const data = {trelloId:""};
    tasks.updateTaskById(taskId, data);
  });
} 

function handleError(err) {
  console.log(err);
}  