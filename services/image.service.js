let fs = require('fs');
let coverOptions = require('../coverOptions');
let Frame  = require('canvas-to-buffer')

let Canvas = require('canvas')
let Image = Canvas.Image

class ImageService {

  constructor(api) {
    this.vkapi = api
  }

  uploadImage() {
    fs.readFile(`${__dirname}/../covers/${coverOptions.outputCoverName}`, (err, image)=>{
      if(err) console.log('something went wrong :(');
      else if(image)
        this._saveImage(image)
    })
  }

  _saveImage(image) {
    this.vkapi.upload('cover', { content: image, name: 'image.png' }, { group_id: coverOptions.groupId, crop_x2: 1590, crop_y2: 400 })
    .then(response => {
      console.log("photo was saved!")
    })
    .catch(error => console.log('Error occured', error));
  }

  _saveResult(canvas){
    let out = fs.createWriteStream(`${__dirname}/../covers/${coverOptions.outputCoverName}`)

    let stream = canvas.pngStream();

    stream.on('data', function(chunk){
      out.write(chunk);
    });

    stream.on('end', () => {
      setTimeout(() => {
        this.uploadImage()
      }, 1000)
    });
  }

  _drawCover(coverImage, obj) {
    let canvas = new Canvas(coverImage.width, coverImage.height)
    let ctx = canvas.getContext('2d');

    if (obj.text)
    ctx.drawImage(coverImage, 0, 0, coverImage.width, coverImage.height);
    ctx.drawImage(obj.photo, 1100, 230, obj.photo.width, obj.photo.height);
    this.drawText(obj, ctx);
    if (coverOptions.saveResult) {
      this._saveResult(canvas);
    } else {
      let frame = new Frame(canvas);
      let buffer = frame.toBuffer();
      this._saveImage(buffer)
    }
  }

  drawText(obj, ctx) {
    ctx.font = "30px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(obj.text, 910, 315);
  }

  makeCover(obj) {
    fs.readFile(`${__dirname}/../covers/${coverOptions.inputCoverName}`, (err, image) => {
      if (err) throw err;
      let coverImage = new Image;
      coverImage.src = image;
      this._drawCover(coverImage, obj)
    })
  }
}

module.exports = ImageService;