# WhatsApp Session Generator (Web QR + Session Download)

এই প্রজেক্টটি দিয়ে তুমি খুব সহজে WhatsApp QR স্ক্যান করে session.json ফাইল জেনারেট করতে পারবে এবং সেটা অন্য বটে ব্যবহার করতে পারবে।

## ✅ Features

- Web Interface দিয়ে QR স্ক্যান
- Session ফাইল (`session.json`) ডাউনলোড করার সুবিধা
- Render বা যেকোনো Node.js হোস্টে রান করানো যাবে
- Baileys library ব্যবহার করা হয়েছে

---

## 🚀 Deploy Guide (Render)

1. **GitHub এ আপলোড করো** এই প্রজেক্টের সব ফাইল
2. **Render.com** এ গিয়ে "New Web Service" নির্বাচন করো
3. নিচের সেটিং ব্যবহার করো:

   - Build Command: `npm install`
   - Start Command: `npm start`
   - Root Directory: *ফাঁকা রাখো*
   - Node Version: `18+` (default usually fine)

4. ডিপ্লয় হলে তোমার ওয়েবসাইট হবে:  
   `https://your-app-name.onrender.com`

---

## 🔄 কিভাবে কাজ করে?

1. ব্রাউজারে গিয়ে “Start Bot & Show QR” ক্লিক করো
2. তোমার WhatsApp দিয়ে QR স্ক্যান করো
3. স্ক্যান শেষ হলে session ফাইল অটো তৈরি হবে
4. `/session` লিংকে গিয়ে session.json ডাউনলোড করো
5. ওই session অন্য বটে পেস্ট করলেই QR ছাড়াই বট চালু!

---

## 📁 Folder Structure
