//npm
let express = require('express');
let Rx = require('rxjs/Rx');

//options
let apiOptions = require('./apiOptions');
let options = require('./options');

//services
let UserService = require('./services/user.service');
let ImageService = require('./services/image.service');
let WallService = require('./services/wall.service');

const vkApiApp = new (require('node-vkapi'))(apiOptions);
const vkApiLoggined = new (require('node-vkapi'))(apiOptions);

//settings
let app = express();
let fs = require('fs');
app.use("/covers", express.static('covers'));

let userService = new UserService(vkApiApp);
let imageService = new ImageService(vkApiApp);
let wallService = new WallService(vkApiLoggined);

var port = process.env.PORT || 4200;

authorizedParams = {
  login: vkApiLoggined.options.userLogin,
  password: vkApiLoggined.options.userPassword,
}

vkApiLoggined.authorize(authorizedParams)
.then((response) => {
  app.listen(port, serve);
})
.catch((e) => {
  console.log(`error ${e}`);
});

function serve() {
  swapCover();

  Rx.Observable
  .interval(60 * 1000 * 5)
  .subscribe(()=>{
    swapCover();
  })
}

function swapCover() {
  let photo = null;
  let winner = null;
  let { ownerId, postId } = options;

  wallService.getAllComments(ownerId, postId)
  .switchMap((fetchedComments) => {
    let winnerPlayerId = wallService.getWinnerPlayerByCommentCount(fetchedComments);
    return Rx.Observable.of(winnerPlayerId);
  })
  .switchMap(id => {
    return userService.getUserById(id);
  })
  .switchMap((user) => {
    winner = user;
    return userService.fetchUserPhoto(winner.photo_100);
  })
  .switchMap((ph) => {
    photo = ph;
    return imageService.readInputCover();
  })
  .subscribe((inputCoverImage) => {
    imageService.makeCover(inputCoverImage, {
      photo: photo,
      top: 0,
      left: 200,
      text: `${winner.first_name} ${winner.last_name}`
    });
 })
}

