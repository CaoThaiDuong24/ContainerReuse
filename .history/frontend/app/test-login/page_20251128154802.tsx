"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestLoginPage() {
  const [username, setUsername] = useState("0000000009")
  const [password, setPassword] = useState("123456")
  const [results, setResults] = useState<any[]>([])

  const testFormats = [
    { name: "username/password", body: (u: string, p: string) => ({ username: u, password: p }) },
    { name: "userName/passWord", body: (u: string, p: string) => ({ userName: u, passWord: p }) },
    { name: "UserName/Password", body: (u: string, p: string) => ({ UserName: u, Password: p }) },
    { name: "email/password", body: (u: string, p: string) => ({ email: u, password: p }) },
    { name: "login/password", body: (u: string, p: string) => ({ login: u, password: p }) },
    { name: "user/pass", body: (u: string, p: string) => ({ user: u, pass: p }) },
    { name: "account/password", body: (u: string, p: string) => ({ account: u, password: p }) },
  ]

  const testAllFormats = async () => {
    setResults([])
    const newResults: any[] = []

    for (const format of testFormats) {
      try {
        const requestBody = format.body(username, password)
        console.log(`Testing format: ${format.name}`, requestBody)

        const response = await fetch("https://apiedepottest.gsotgroup.vn/api/Users/Login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify(requestBody)
        })

        const responseText = await response.text()
        let data
        try {
          data = JSON.parse(responseText)
        } catch {
          data = responseText
        }

        newResults.push({
          format: format.name,
          status: response.status,
          success: response.ok,
          response: data,
          requestBody: requestBody
        })

        console.log(`Result for ${format.name}:`, {
          status: response.status,
          data
        })
      } catch (error) {
        newResults.push({
          format: format.name,
          status: "ERROR",
          success: false,
          response: error instanceof Error ? error.message : "Unknown error",
          requestBody: format.body(username, password)
        })
      }
    }

    setResults(newResults)
  }

  return (
    <div className="min-h-screen p-8 bg-slate-50">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Test API Login Formats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Username</label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Password</label>
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                type="password"
              />
            </div>
          </div>

          <Button onClick={testAllFormats} className="w-full">
            Test All Formats
          </Button>

          <div className="space-y-2 mt-6">
            {results.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded border ${
                  result.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                }`}
              >
                <div className="font-bold text-sm mb-2">
                  {result.format} - Status: {result.status}
                </div>
                <div className="text-xs space-y-1">
                  <div>
                    <strong>Request:</strong>{" "}
                    <code className="bg-white px-2 py-1 rounded">
                      {JSON.stringify(result.requestBody)}
                    </code>
                  </div>
                  <div>
                    <strong>Response:</strong>{" "}
                    <code className="bg-white px-2 py-1 rounded">
                      {JSON.stringify(result.response)}
                    </code>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
