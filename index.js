let express = require('express');
let options = require('./options');
let UserService = require('./services/user.service');
let ImageService = require('./services/image.service');

const vkapi = new (require('node-vkapi'))(options);

let app = express();
let fs = require('fs');

let userService = new UserService(vkapi);
let imageService = new ImageService(vkapi);

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function getResultIndexList(array, exeptions) {
  return array.filter(f => !exeptions.includes(f));
}

app.use("/covers", express.static('covers'));

var port = process.env.PORT || 4200;

app.listen(port, run);

// function serve() {
//   setInterval(run, 3600);
// }

function run() {
  userService.getMembersOfGroupWithId(76660997).then((res) => {
    let items = getResultIndexList(res.items, [55063113, 217276010, 279551906, 99651108, 60833780, 126356305, 27077007]);
    idNum = getRandomInt(0, items.length - 1);
    return items[idNum];
  }).then((id)=> {
    userService.getById(id)
    .then((user) => {
      userService.fetchPhoto(user.photo_100)
      .then(ph => {
        imageService.makeCover({photo: ph, top: 0, left: 200, text: " =>> "})
      })
    })
  })
}