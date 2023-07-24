const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const router = express.Router();
const secretKey = process.env.JWT_SECRET;  // 請在.env文件中設定你的JWT秘鑰

// 用於示範的用戶數據，實際應用應該從資料庫中獲取
const users = [
  {
    id: 1,
    username: 'user',
    password: bcrypt.hashSync('pass', 10),  // 密碼應該被加密存儲
  },
];

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = users.find(user => user.username === username);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).send('Username or password is incorrect');
  }

  // 生成JWT
  const token = jwt.sign({ id: user.id }, secretKey);

  res.json({ token });
});

module.exports = router;