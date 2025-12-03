import { BarChart3, TrendingUp, Globe, Zap } from "lucide-react"

export default function StatsSection() {
  const stats = [
    {
      icon: BarChart3,
      label: "Hiệu suất tăng",
      value: "98%",
      description: "Cải thiện thời gian xử lý",
    },
    {
      icon: TrendingUp,
      label: "Tiết kiệm chi phí",
      value: "40%",
      description: "Giảm chi phí logistics",
    },
    {
      icon: Globe,
      label: "Carbon giảm",
      value: "50 tấn",
      description: "CO2 đã tránh phát thải",
    },
    {
      icon: Zap,
      label: "Tốc độ xử lý",
      value: "5x",
      description: "Nhanh hơn phương pháp cũ",
    },
  ]

  return (
    <section id="stats" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <div className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="bg-card border border-border rounded-2xl p-6 hover:border-primary/30 transition-all hover:shadow-lg"
            >
              <div className="mb-4 inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg">
                <Icon size={24} className="text-primary" />
              </div>
              <p className="text-foreground/60 text-sm mb-2">{stat.label}</p>
              <p className="text-3xl font-bold text-primary mb-1">{stat.value}</p>
              <p className="text-foreground/50 text-xs">{stat.description}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
