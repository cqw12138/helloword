var fs = require("fs");
//代码阻塞
// var data = fs.readFileSync('input.txt');
//
// console.log(data.toString());
// console.log("程序执行结束");
//非代码阻塞
// fs.readFile('input.txt', function (err, data) {
//   if (err) return console.error(err);
//   console.log(data.toString());
// });
//
// console.log("程序执行结束!非代码阻塞执行完毕！");

fs.readFile('input.txt', function (err, data) {
  if (err) return console.log(err.stack);
  console.log(data.toString());
});
console.log('异步程序执行完毕！');

// 事件驱动

// 引入events模块
var events = require("events");
// 创建eventEmitter对象
var eventEmitter = new events.EventEmitter();
// 创建事件处理程序
var connectHandler = function connected() {
  console.log('链接成功!');
// 触发 data_received 事件
  eventEmitter.emit('data_received');
}
// 绑定 connection 事件处理程序
eventEmitter.on('connection', connectHandler);

// 使用匿名函数绑定 data_received 事件
eventEmitter.on('data_received', function (){
  console.log('数据接收成功！');
});
// 触发 connection 事件
eventEmitter.emit('connection');

console.log('程序执行完毕！事件驱动成功！');

//监听

//监听器 #1
var lister1 = function lister1() {
  console.log('监听器 lister1 执行！');
}
var lister2 = function lister2() {
  console.log('监听器 lister2 执行！');
}

eventEmitter.addListener('connection', lister1);

eventEmitter.on('connection', lister2);

var eventListeners = require('events').EventEmitter.listenerCount(eventEmitter, 'connection');
console.log(eventListeners + '监听器监听链接事件！');

eventEmitter.emit('connection');

eventEmitter.removeListener('connection', lister1);
console.log('lister1()不受监控了！');

eventEmitter.emit('connection');

eventListeners = require('events').EventEmitter.listenerCount(eventEmitter, 'connection');
console.log(eventListeners + '监听器监听链接事件了！');

console.log('监听执行完毕！OVER');
