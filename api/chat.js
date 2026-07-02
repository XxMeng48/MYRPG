export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  // 使用 process.env 读取，确保你已经在 Vercel 后台配置好了 GEMINI_API_KEY
  const apiKey = process.env.GEMINI_API_KEY;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: req.body.message }] }] })
    });
    
    const data = await response.json();
    
    // 如果 Google 返回了错误信息，把这个错误信息返回给前端
    if (!response.ok) {
        return res.status(response.status).json({ error: data.error?.message || 'API 调用失败' });
    }
    
    res.status(200).json(data);
  } catch (error) {
    // 捕获网络层面的异常
    res.status(500).json({ error: "服务器通讯异常: " + error.message });
  }
}
