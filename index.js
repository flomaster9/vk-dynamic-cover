let express = require('express');
let apiOptions = require('./apiOptions');
let UserService = require('./services/user.service');
let ImageService = require('./services/image.service');
let WallService = require('./services/wall.service');

let Rx = require('rxjs/Rx');

const vkApiApp = new (require('node-vkapi'))(apiOptions);
const vkApiLoggined = new (require('node-vkapi'))(apiOptions);

let app = express();
let fs = require('fs');

let userService = new UserService(vkApiApp);
let imageService = new ImageService(vkApiApp);
let wallService = new WallService(vkApiLoggined);

app.use("/covers", express.static('covers'));

var port = process.env.PORT || 4200;

authorizedParams = {
  login: vkApiLoggined.options.userLogin,
  password: vkApiLoggined.options.userPassword,
}

vkApiLoggined.authorize(authorizedParams).then((response) => {
  app.listen(port, serve);
}).catch((e) => {
  console.log(`error ${e}`);
});

function serve() {
  console.log(new Date());
  swapCover();

  Rx.Observable
  .interval(60 * 1000 * 5)
  .subscribe(()=>{
    swapCover();
  })
}

function swapCover() {
  let photo = null;
  let ownerId = "-36039";
  let postId = "3473494";

  wallService.getAllComments(ownerId, postId)
  .switchMap((fetchedComments) => {
    let winnerPlayerId = wallService.getWinnerPlayerByCommentCount(fetchedComments);
    return Rx.Observable.of(winnerPlayerId);
  })
  .switchMap(id => {
    return userService.getUserById(id);
  })
  .switchMap((user) => {
    return userService.fetchUserPhoto(user.photo_100);
  })
  .switchMap((ph) => {
    photo = ph;
    return imageService.readInputCover();
  })
  .subscribe((inputCoverImage) => {
    imageService.makeCover(inputCoverImage, {photo: photo, top: 0, left: 200, text: "hello world"})
 })
}

