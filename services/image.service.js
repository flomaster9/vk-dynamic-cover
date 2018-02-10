let fs = require('fs');
let coverOptions = require('../coverOptions');
let Frame  = require('canvas-to-buffer')

let Canvas = require('canvas')
let Image = Canvas.Image

let Rx = require('rxjs/Rx')

function getTimestamp() {
  return Math.floor(Date.now() / 1000);
}

class ImageService {

  constructor(api) {
    this.vkapi = api
  }

  _saveImageToServer(image) {
    this.vkapi.upload('cover', {
      content: image,
      name: 'image.png' 
    }, {
      group_id: coverOptions.groupId,
      crop_x2: 1590,
      crop_y2: 400 
    })
    .then(response => {
      console.log("photo was uploaded!")
    })
    .catch((e) => {
      console.log(`error ${e}`);
    });
  }

  _saveImageToDisk(canvas){
    let out = fs.createWriteStream(`${__dirname}/../covers/${coverOptions.outputCoverName}__${getTimestamp()}.jpg`)
    let stream = canvas.pngStream();

    stream.on('data', function(chunk){
      out.write(chunk);
    });

    stream.on('end', () => {
      console.log("photo was saved!")
    });
  }

  makeCover(coverImage, params) {
    let canvas = new Canvas(coverImage.width, coverImage.height)
    let ctx = canvas.getContext('2d');

    if (params.text) {
      ctx.drawImage(coverImage, 0, 0, coverImage.width, coverImage.height);
      ctx.drawImage(params.photo, 1100, 230, params.photo.width, params.photo.height);
      this._drawText(params, ctx);
    }

    let frame = new Frame(canvas);
    let bufferedFrame = frame.toBuffer();
    this._saveImageToServer(bufferedFrame)

    if (coverOptions.saveResult) {
      this._saveImageToDisk(canvas);
    }
  }

  _drawText(params, ctx) {
    ctx.font = "30px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(params.text, 910, 315);
  }

  readInputCover() {
    let image = fs.readFileSync(`${__dirname}/../covers/${coverOptions.inputCoverName}`);
    let coverInputImage = new Image;
    coverInputImage.src = image;
    return Rx.Observable.of(coverInputImage);
  }
}

module.exports = ImageService;