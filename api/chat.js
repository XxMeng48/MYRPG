export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" });
  
  const { message } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  try {
    // 强制使用最通用的地址，模型名称直接固定为 gemini-1.5-flash
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        contents: [{ parts: [{ text: message }] }] 
      })
    });
    
    const data = await response.json();
    
    // 如果返回数据里有 error，直接传回前端
    if (data.error) {
        return res.status(500).json({ error: data.error.message });
    }
    
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "服务器内部错误: " + error.message });
  }
}
