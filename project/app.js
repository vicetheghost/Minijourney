const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

// Cấu hình phục vụ tệp tĩnh
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Route để lấy dữ liệu từ answers.json
app.get("/search", (req, res) => {
  const query = req.query.q.toLowerCase();
  console.log("Query received:", query); // Kiểm tra xem query có được gửi tới server không

  fs.readFile("./data/answers.json", "utf8", (err, jsonData) => {
    if (err) {
      console.error("Error reading answers.json:", err);
      return res.status(500).send("Error reading data.");
    }

    const data = JSON.parse(jsonData);
    console.log("Data loaded:", data); // Kiểm tra dữ liệu đã được đọc

    const result = data.find(
      (item) =>
        item.question.toLowerCase().includes(query) ||
        item.tags.some((tag) => tag.toLowerCase().includes(query))
    );

    console.log("Result:", result); // Kiểm tra kết quả tìm kiếm

    if (result) {
      res.json({ answer: result.answer, image: result.image });
    } else {
      res.json({ answer: "No results found", image: null });
    }
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});




