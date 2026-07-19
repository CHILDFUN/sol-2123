const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// تشغيل الملفات الثابتة (مثل index.html) من مجلد الواجهة
app.use(express.static(path.join(__dirname, 'public')));

// في حال لم يكن لديك مجلد public، يمكنك تفعيل السطر التالي لقراءة الملف مباشرة:
// app.get('/', (req, res) => { res.sendFile(__dirname + '/index.html'); });

io.on('connection', (socket) => {
    console.log('مستخدم جديد اتصل بالدردشة');

    // استقبال الرسالة من أي مستخدم وبثها فورًا للجميع دون استثناء
    socket.on('sendMessage', (data) => {
        io.emit('messageReceived', {
            user: data.user,
            message: data.message
        });
    });

    socket.on('disconnect', () => {
        console.log('مستخدم غادر الدردشة');
    });
});

// تحديد المنفذ المناسب لـ Render أو التشغيل المحلي
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`السيرفر يعمل بنجاح على المنفذ ${PORT}`);
});
