var express = require('express');
var multer  = require('multer') ;
var mongoose = require('mongoose');
var uploadspModel = require('../model/uploadsp');
var router = express.Router();

mongoose.connect('mongodb://localhost/sanpham', { useMongoClient: true });

var anhs = [];
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './anhsanpham')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname) ;
  }
})

var upload = multer({ storage: storage })
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET home page. */
router.post('/uploadfile',upload.any(), function(req, res, next) {
  var tentamthoi = req.files[0].path;  
  anhs.push(tentamthoi); // dua ten ảnh vào mảng dữ liệu đã khai báo ở trên 
  console.log(anhs);
  res.status(200).send(req.files);  
});

/* GET up sản phẩm page. */
router.post('/upsanpham', function(req, res, next) {
  var ten = req.body.ten, gia = req.body.gia ; 
  // dinh nghia mot doi tuong de insert 
  var motdoituong = {
    "ten":ten,
    "gia":gia,
    "anh":anhs
  }
  var dulieu = new uploadspModel(motdoituong); 
  dulieu.save() ; 
  res.render('thanhcong');
});

/* GET home page. */
router.get('/xemsp', function(req, res, next) {
  // su dung mongoose lay du lieu va đổ dữ liệu ra xemsp.ejs
  uploadspModel.find({},function(error,dulieu){
    console.log(dulieu);
    res.render('xemsp', { data: dulieu });
  })


  
});
module.exports = router;
