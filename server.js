const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" } // للسماح بالاتصال من أي مكان
});

// تقديم ملف الواجهة للمستخدم
app.use(express.static(path.join(__dirname)));

io.on('connection', (socket) => {
  console.log('مستخدم جديد اتصل بالدردشة');

  // استقبال الرسالة من مستخدم وإرسالها للبقية
  socket.on('chat message', (data) => {
    io.emit('chat message', data); 
  });

  socket.on('disconnect', () => {
    console.log('مستخدم غادر الدردشة');
  });
});

// Render يحدد المنفذ تلقائياً عبر Process.env.PORT
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`السيرفر يعمل على المنفذ ${PORT}`);
});
