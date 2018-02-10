var fetch = require('node-fetch');
let Canvas = require('canvas');
let Image = Canvas.Image;
var Observable = require('rxjs/Observable').Observable;
require('rxjs/add/operator/map');
let Rx = require('rxjs/Rx');

class WallService {

  constructor(api) {
    this.vkapi = api;
    this.lastOffset = 0;
    this.commentCountToGet = 20;
    this.commentCount;
  }

  //use "-" prefix for ownerId to search from groups
  getAllComments(ownerId, postId) {
    let fetchedComments = [];

    return Observable.fromPromise(
      this._getCommentsChunk(ownerId, postId, fetchedComments)
    )
  }

  getWinnerPlayerByCommentCount(comments) {
    let players = {};

    comments
    .filter((c) => c.text.length >= 3)
    .forEach((c) => players[c.from_id] ? players[c.from_id] += 1 : players[c.from_id] = 1)

    return this._getMaxCommentPlayerId(players);
  }

  _getMaxCommentPlayerId(players) {
    let winnerId = null;
    let max = 0;

    for (let p in players) {
      if (players[p] > max) {
        max = players[p];
        winnerId = p;
      }
    }
    console.log(`for last 5 minutes winner is ${winnerId} with ${players[winnerId]} comments`)
    return winnerId;
  }

  _getCommentsChunk(ownerId, postId, fetchedComments) {
    return this.vkapi.call('wall.getComments', {
      owner_id: ownerId,
      post_id: postId,
      count: this.commentCountToGet,
      offset: this.lastOffset
    })
    .then((res) => {
      this.commentCount = res.count;
      res.items.forEach((comment) => fetchedComments.push(comment));

      this.lastOffset = this.lastOffset + this.commentCountToGet > this.commentCount ? 
                        this.commentCount : this.lastOffset + this.commentCountToGet;

      if (this.commentCount > this.lastOffset) {
        return this._getCommentsChunk(ownerId, postId, fetchedComments);
      } else {
        console.log(`get ${fetchedComments.length} comments from ${this.commentCount}`);
        return fetchedComments;
      }
    })
    .catch((e) => {
      console.log(`error ${e}`);
    });
  }
}

module.exports = WallService;