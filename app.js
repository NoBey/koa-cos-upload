const Koa = require('koa');
const route = require('koa-route');
const multer = require('koa-multer');

var COS = require('cos-nodejs-sdk-v5');
// 创建实例
var cos = new COS({
    SecretId: 'AKIDbqdPrYEpqAPFOOekjemKwHDm0divAXfk',
    SecretKey: 'krNSz6jcS4uBpIAgr3MW5g3k4yb4ndr1',
});
// 分片上传
var upcos = (file) => new Promise(function(resolve, reject){
  cos.sliceUploadFile({
      Bucket: 'test-1251325637',
      Region: 'ap-chengdu',
      Key: file.filename,
      FilePath: file.path
  }, function (err, data) {
      resolve(data)
  });
});

const app = new Koa();
var storage = multer.diskStorage({
  //文件保存路径
  destination: function(req, file, cb) {
    cb(null, 'uploads/')
  },
  //修改文件名称
  filename: function(req, file, cb) {
    var fileFormat = (file.originalname).split(".");
    cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1]);
  }
})
//加载配置
var upload = multer({storage});

app.use(route.post('/profile', upload.single('avatar') ))

app.use(
  async (c, n) => {
    if(!c.req.file) return c.body = 'no'
    const file = c.req.file
    const data = await upcos(file)
    console.log(data)
    return c.body = data
    
  }
)

app.listen(12306);