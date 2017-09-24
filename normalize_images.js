const fs = require('fs'),
      jimp = require('jimp'),
      Rx = require('rxjs/Rx'),
      imgSize = require('image-size');

let opts = {
    'IMAGE_SIZE': 256,
    'DATASET_PATH': './Wiki Art Data/'
};

let normalize_path = opts.DATASET_PATH + 'normalized_' + opts.IMAGE_SIZE;

var deleteFolderRecursive = function(path) {
  if( fs.existsSync(path) ) {
    fs.readdirSync(path).forEach(function(file,index){
      var curPath = path + "/" + file;
      if(fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

if(fs.existsSync(normalize_path)) {
    console.log('Removing normalize directory... ', normalize_path);
    deleteFolderRecursive(normalize_path);
}

console.log('Creating normalize directory... ', normalize_path);
fs.mkdirSync(normalize_path);

let images = fs.readdirSync(opts.DATASET_PATH)
                            .filter((v, i) => (v.endsWith('.jpg') || v.endsWith('.jpeg') || v.endsWith('.png')))
                            .map(file_name => ({file_name, 'size': imgSize(opts.DATASET_PATH + file_name)}));

Rx.Observable.from(images)
    .mergeMap((image_info) =>
        Rx.Observable.fromPromise(jimp.read(opts.DATASET_PATH + image_info.file_name)),
        (image_info, image) => ({image_info, image})
    )
    .subscribe(({image_info, image}) => {
        // let size = imgSize(opts.DATASET_PATH + image_file_name);
        console.log('Resizing ', image_info.file_name, ' to ', opts.IMAGE_SIZE, ' x ', opts.IMAGE_SIZE);
        image.resize(opts.IMAGE_SIZE, opts.IMAGE_SIZE)
            .quality(100)
            .write(normalize_path + '/' + image_info.file_name);
    })