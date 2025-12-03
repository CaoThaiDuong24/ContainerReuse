import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 bg-secondary/50 px-3 py-1 rounded-full border border-border">
            <span className="w-2 h-2 bg-primary rounded-full"></span>
            <span className="text-sm text-foreground/70">Giải pháp tái chế bền vững</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
            Tương lai của <span className="text-primary">logistics bền vững</span>
          </h1>

          <p className="text-xl text-foreground/60 leading-relaxed">
            Nền tảng công nghệ thông minh cho quản lý tái chế container. Giảm chi phí, tăng hiệu quả, bảo vệ môi trường.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-base">
              Khám phá ngay <ArrowRight className="ml-2" size={20} />
            </Button>
            <Button size="lg" variant="outline" className="text-base bg-transparent">
              Xem demo
            </Button>
          </div>

          <div className="flex flex-wrap gap-6 pt-8 border-t border-border/30">
            <div>
              <p className="text-2xl font-bold text-primary">10.000+</p>
              <p className="text-sm text-foreground/60">Container đã tái chế</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">500+</p>
              <p className="text-sm text-foreground/60">Công ty sử dụng</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">40%</p>
              <p className="text-sm text-foreground/60">Tiết kiệm chi phí</p>
            </div>
          </div>
        </div>

        {/* Right Visual */}
        <div className="relative h-96 md:h-full min-h-96">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl border border-border/30"></div>
          <div className="absolute inset-4 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl border border-border/20 flex items-center justify-center">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-primary/10 rounded-2xl mb-4">
                <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center">
                  <span className="text-4xl">📦</span>
                </div>
              </div>
              <p className="text-foreground/60 text-sm">Quản lý container</p>
              <p className="text-foreground font-semibold">Thông minh & Hiệu quả</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
