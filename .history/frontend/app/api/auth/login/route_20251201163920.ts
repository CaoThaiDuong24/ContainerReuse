import { NextRequest, NextResponse } from 'next/server'

interface LoginRequest {
  username: string
  password: string
}

interface ExternalApiResponse {
  token: string
  username: string
  accuserkey: string
}

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json()
    
    console.log("API Route - Login request:", body)

    if (!body.username || !body.password) {
      return NextResponse.json(
        { error: "Username và password là bắt buộc" },
        { status: 400 }
      )
    }

    // Gọi external API
    const externalApiUrl = process.env.NEXT_PUBLIC_EXTERNAL_API_URL || 'https://apiedepottest.gsotgroup.vn'
    
    const requestBody = {
      user: body.username,
      password: body.password
    }

    console.log("API Route - Calling external API:", externalApiUrl)
    
    const response = await fetch(`${externalApiUrl}/api/Users/Login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(requestBody)
    })

    const responseText = await response.text()
    console.log("API Route - External API response:", responseText)

    if (!response.ok) {
      return NextResponse.json(
        { error: `Đăng nhập thất bại: ${responseText}` },
        { status: response.status }
      )
    }

    let data: ExternalApiResponse
    try {
      data = JSON.parse(responseText)
    } catch (parseError) {
      console.error("API Route - JSON parse error:", parseError)
      return NextResponse.json(
        { error: "Lỗi phản hồi từ server" },
        { status: 500 }
      )
    }

    if (!data.token) {
      return NextResponse.json(
        { error: "Token không hợp lệ" },
        { status: 401 }
      )
    }

    // Trả về response thành công
    return NextResponse.json({
      token: data.token,
      username: data.username,
      accuserkey: data.accuserkey
    })

  } catch (error) {
    console.error("API Route - Error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Lỗi server" },
      { status: 500 }
    )
  }
}
