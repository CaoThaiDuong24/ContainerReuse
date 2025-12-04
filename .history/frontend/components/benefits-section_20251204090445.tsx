import { Leaf, Target, Users, TrendingUp } from "lucide-react"

export default function BenefitsSection() {
  const benefits = [
    {
      icon: Leaf,
      title: "Bền vững",
      description: "Giảm phát thải CO2 và tác động môi trường thông qua tái chế container hiệu quả",
    },
    {
      icon: Target,
      title: "Hiệu quả",
      description: "Tối ưu hóa quy trình logistics với công nghệ AI và machine learning",
    },
    {
      icon: Users,
      title: "Hợp tác",
      description: "Kết nối cộng đồng doanh nghiệp logistics toàn cầu",
    },
    {
      icon: TrendingUp,
      title: "Tăng trưởng",
      description: "Mở rộng kinh doanh với chi phí vận hành thấp hơn",
    },
  ]

  return (
    <section id="benefits" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-4xl font-bold text-foreground mb-6">Lợi ích kinh doanh</h2>
          <p className="text-lg text-foreground/60 mb-8 leading-relaxed">
            Nền tảng Container Reuse mang lại giá trị vượt trội cho các doanh nghiệp logistics hiện đại.
          </p>
          <div className="space-y-4">
            {benefits.slice(0, 2).map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <div key={`benefit-left-${index}`} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10">
                      <Icon size={20} className="text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{benefit.title}</h3>
                    <p className="text-foreground/60 text-sm">{benefit.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="space-y-4">
          {benefits.slice(2).map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <div key={`benefit-right-${index}`} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10">
                    <Icon size={20} className="text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{benefit.title}</h3>
                  <p className="text-foreground/60 text-sm">{benefit.description}</p>
                </div>
              </div>
            )
          })}
          <div className="mt-8 p-6 bg-primary/5 border border-primary/20 rounded-xl">
            <p className="text-foreground text-sm leading-relaxed">
              <span className="font-semibold text-primary">Khách hàng đánh giá 5 sao</span> - "Giảm chi phí 40% trong 6
              tháng đầu sử dụng"
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
