import { CheckCircle2, Smartphone, Shield, Zap } from "lucide-react"
import { Card } from "@/components/ui/card"

export default function FeaturesSection() {
  const features = [
    {
      icon: Smartphone,
      title: "Quản lý di động",
      description: "Theo dõi container realtime từ bất kỳ nơi đâu",
    },
    {
      icon: Shield,
      title: "Bảo mật cao",
      description: "Mã hóa end-to-end cho tất cả dữ liệu",
    },
    {
      icon: Zap,
      title: "Tích hợp dễ dàng",
      description: "API mạnh mẽ cho kết nối hệ thống",
    },
    {
      icon: CheckCircle2,
      title: "Tự động hóa",
      description: "Giảm công việc thủ công 80%",
    },
  ]

  return (
    <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Tính năng chính</h2>
        <p className="text-xl text-foreground/60">Công nghệ tiên tiến cho quản lý container hiệu quả</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature) => {
          const Icon = feature.icon
          return (
            <Card
              key={feature.title}
              className="bg-card border-border p-6 hover:border-primary/50 transition-all hover:shadow-xl hover:-translate-y-1"
            >
              <div className="mb-4 inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg">
                <Icon size={24} className="text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-foreground/60 text-sm">{feature.description}</p>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
