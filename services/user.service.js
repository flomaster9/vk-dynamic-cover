var fetch = require('node-fetch');
let Canvas = require('canvas');
let Image = Canvas.Image;
var Observable = require('rxjs/Observable').Observable;
require('rxjs/add/operator/map');

class UserService {

  constructor(api) {
    this.vkapi = api;
  }

  getMembersOfGroupWithId(id) {
    return Observable.fromPromise(
      this.vkapi.call('groups.getMembers', {
        group_id: id,
      })
    )
  }

  getUserById(id) {
    return Observable.fromPromise(
      this.vkapi.call('users.get', {
        user_ids: id,
        fields: "photo_100",
      })
    ).map(users => users[0]);
  }

  fetchUserPhoto(url) {
    return Observable.fromPromise(
      fetch(url)
      .then((res) => {
        return res.buffer();
      })
      .then((buffer) => {
        let img = new Image;
        img.src = buffer;
        return img;
      })
      .catch((e) => {
        console.log(`error ${e}`);
      })
    )
  }
}

module.exports = UserService;