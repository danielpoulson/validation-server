const request = require("request");
const tasks = require("../controllers/tasks")
const config = require("../config/config")
const api = config.trello.API_KEY;
const token = config.trello.TOKEN;

// const labels = [ 
//   { id: '5a09fbf7652e5bd23c9835a0',
//     idBoard: '5a09fb675e9f0abca157711f',
//     name: 'High',
//     color: 'red' },
//   { id: '5a09fd09e6d9ddbf48e3ae6b',
//     idBoard: '5a09fb675e9f0abca157711f',
//     name: 'Easy',
//     color: 'green' },
//   { id: '5a09fb679ae3d60b0cbdf472',
//     idBoard: '5a09fb675e9f0abca157711f',
//     name: 'Val',
//     color: 'blue' },
//   { id: '5a09fb679ae3d60b0cbdf470',
//     idBoard: '5a09fb675e9f0abca157711f',
//     name: 'Med',
//     color: 'orange' },
//   { id: '5a29aa994406ca75b529e05d',
//     idBoard: '5a09fb675e9f0abca157711f',
//     name: 'Complex',
//     color: 'red' },
//   { id: '5a29aa67cec4e036574b19e6',
//     idBoard: '5a09fb675e9f0abca157711f',
//     name: 'Low',
//     color: 'green' },
//   { id: '5a09fb679ae3d60b0cbdf46f',
//     idBoard: '5a09fb675e9f0abca157711f',
//     name: 'Moderate',
//     color: 'orange' } 
// ];

function formatLabels(status) {
  let _status = "5a09fb679ae3d60b0cbdf46f";

  switch (+status) {
    case 1:
      _status = "5a09fbf7652e5bd23c9835a0,5a09fd09e6d9ddbf48e3ae6b";
      break;
    case 2:
      _status = "5a09fbf7652e5bd23c9835a0,5a09fb679ae3d60b0cbdf46f";
      break;
    case 3:
      _status = "5a09fbf7652e5bd23c9835a0,5a29aa994406ca75b529e05d";
      break;
    case 4:
      _status = "5a09fb679ae3d60b0cbdf470,5a09fd09e6d9ddbf48e3ae6b";
      break;
    case 5:
      _status = "5a09fb679ae3d60b0cbdf470,5a09fb679ae3d60b0cbdf46f";
      break;
    case 6:
      _status = "5a09fb679ae3d60b0cbdf470,5a29aa994406ca75b529e05d";
      break;
    case 7:
      _status = "5a29aa67cec4e036574b19e6,5a09fd09e6d9ddbf48e3ae6b";
      break;
    default:
      _status = "5a09fb679ae3d60b0cbdf46f";
  }
  return _status;
}

exports.addTrello = function(task) {
  const options = {
    method: "POST",
    url: `https://api.trello.com/1/cards?key=${api}&token=${token}`,
    qs: {
      name: task.name,
      pos: "top",
      due: task.due,
      desc: task.desc,
      idList: "5a09fb675e9f0abca1577120",
      idLabels: formatLabels(task.status),
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

exports.updateTrelloCard = (task) => {
  // const labels = formatLabels(task.status);
  // console.log(labels);
  const options = {
    method: "PUT",
    url: `https://api.trello.com/1/cards/${task.trelloId}?key=${api}&token=${token}`,
    qs: {
      name: task.name,
      due: task.due,
      desc: task.desc,
      idLabels: formatLabels(task.status)
    }
  };

  request(options, function(error, response, body) {
    if (error) console.log(error);
    // console.log(body);
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