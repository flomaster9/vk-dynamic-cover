var fetch = require('node-fetch');
let Canvas = require('canvas')
let Image = Canvas.Image

class UserService {

  constructor(api) {
    this.vkapi = api;
    this.targetUser = null;
  }

  getMembersOfGroupWithId(id) {
    return this.vkapi.call('groups.getMembers', {
      group_id: id,
    })
  }

  getById(id) {
    return this.vkapi.call('users.get', {
      user_ids: id,
      fields: "photo_100",
    })
    .then(users => {
      this.targetUser = users[0] || null;
      return users[0];
    });
  }

  fetchPhoto(url) {
    return fetch(url)
      .then(function(res) {
        return res.buffer();
      }).then(function(buffer) {
        let img = new Image;
        img.src = buffer;
        return img;
      });
  }
}

module.exports = UserService;