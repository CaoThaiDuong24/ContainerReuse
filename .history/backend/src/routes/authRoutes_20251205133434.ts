import { Router, Request, Response } from 'express';

const router = Router();

interface LoginRequest {
  username: string;
  password: string;
}

// Login endpoint
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password }: LoginRequest = req.body;

    console.log('🔐 Login request received:', { username });

    if (!username || !password) {
      return res.status(400).json({
        error: 'Username và password là bắt buộc'
      });
    }

    // Gọi external API
    const externalApiUrl = process.env.EXTERNAL_API_URL || 'https://apiedepottest.gsotgroup.vn';
    
    const requestBody = {
      user: username,
      password: password
    };

    console.log('🌐 Calling external API:', externalApiUrl);

    const response = await fetch(`${externalApiUrl}/api/Users/Login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    const responseText = await response.text();
    console.log('📥 External API response:', responseText);

    if (!response.ok) {
      return res.status(response.status).json({
        error: `Đăng nhập thất bại: ${responseText}`
      });
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError);
      return res.status(500).json({
        error: 'Lỗi phản hồi từ server'
      });
    }

    if (!data.token) {
      return res.status(401).json({
        error: 'Token không hợp lệ'
      });
    }

    console.log('✅ Login successful for user:', data.username);

    // Trả về response thành công
    return res.json({
      token: data.token,
      username: data.username,
      accuserkey: data.accuserkey
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Lỗi server'
    });
  }
});

// Logout endpoint
router.post('/logout', async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    const username = req.body.username;

    console.log('🚪 Logout request received:', { username });

    // Có thể thêm logic invalidate token ở đây nếu cần
    // Ví dụ: blacklist token, ghi log, etc.

    return res.json({
      success: true,
      message: 'Đăng xuất thành công'
    });

  } catch (error) {
    console.error('❌ Logout error:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Lỗi server'
    });
  }
});

export default router;
