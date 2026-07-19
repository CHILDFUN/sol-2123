const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

// تشغيل الملفات الثابتة (مثل ملف index.html) من نفس المجلد
app.use(express.static(path.join(__dirname)));

io.on('connection', (socket) => {
    let currentClientName = "مجهول";

    // عند دخول مستخدم جديد وتحديد اسمه
    socket.on('new user', (username) => {
        currentClientName = username;
        io.emit('system message', `📢 انضم ${username} إلى الدردشة`);
    });

    // عند استقبال رسالة، نقوم بتوزيعها على كل المتصلين بالوقت الفعلي
    socket.on('chat message', (data) => {
        io.emit('chat message', data);
    });

    // عند خروج المستخدم أو إغلاق الصفحة
    socket.on('disconnect', () => {
        io.emit('system message', `🚶 غادر ${currentClientName} الدردشة`);
    });
});

// تحديد المنفذ تلقائياً ليتوافق مع منصة Render
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`السيرفر يعمل بنجاح على المنفذ: ${PORT}`);
});
