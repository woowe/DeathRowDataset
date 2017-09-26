const fs = require('fs'),
      jimp = require('jimp'),
      Rx = require('rxjs/Rx'),
      imgSize = require('image-size');

let opts = {
    'IMAGE_SIZE': 512,
    'DATASET_PATH': './Data/images/'
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
    .map(file_name => ({file_name}));

let $normalize_images = Rx.Observable.create((observer) => {
    if(images.length === 0) {
        console.log('Complete');
        observer.complete({image_info: null});
    }

    let image_info = images.pop();

    jimp.read(opts.DATASET_PATH + image_info.file_name)
        .then(image => {
            if(image.bitmap.width >= opts.IMAGE_SIZE && image.bitmap.height >= opts.IMAGE_SIZE) {
                console.log('Resizing... ', image_info.file_name, ' +++ ', image.bitmap.width, 'x', image.bitmap.height);
                console.log('Saving to...', normalize_path + '/' + image_info.file_name);
                image.cover(opts.IMAGE_SIZE, opts.IMAGE_SIZE)
                    .quality(100)
                    .write(normalize_path + '/' + image_info.file_name);
            }
            observer.next({image_info});
        })
        .catch(err => console.log(image_info.file_name, '\nError ', err))
});

$normalize_images
    // .last()
    .take(images.length)
    .subscribe(({image_info}) => {
        // console.log('Finished!');
    });

// Rx.Observable.interval(1000) 
//     .filter(i => i < images.length)
//     .map(i => images[i])
//     .mergeMap(image_info =>
//         Rx.Observable.fromPromise(
//           jimp.read(opts.DATASET_PATH + image_info.file_name)),
//         (image_info, image) => ({image_info, image})
//     )
//     .subscribe(({image_info, image}) => {
        
//     })