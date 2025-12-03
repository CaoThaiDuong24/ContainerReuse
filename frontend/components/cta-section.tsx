import { Button } from "@/components/ui/button"
import { ArrowRight, Mail } from "lucide-react"

export default function CTASection() {
  return (
    <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/5 border border-primary/20 rounded-3xl p-12 md:p-16 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Sẵn sàng bắt đầu?</h2>
        <p className="text-xl text-foreground/60 mb-8 max-w-2xl mx-auto">
          Tham gia hàng trăm công ty đã chuyển đổi sang quản lý logistics bền vững
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-base">
            Đăng ký miễn phí <ArrowRight className="ml-2" size={20} />
          </Button>
          <Button size="lg" variant="outline" className="text-base bg-transparent">
            <Mail size={20} className="mr-2" />
            Liên hệ sales
          </Button>
        </div>

        <div className="mt-12 pt-12 border-t border-primary/10">
          <p className="text-foreground/50 text-sm mb-4">Được tin tưởng bởi</p>
          <div className="flex justify-center items-center gap-8 flex-wrap opacity-60">
            <span className="font-semibold text-foreground/40">FedEx</span>
            <span className="font-semibold text-foreground/40">DHL</span>
            <span className="font-semibold text-foreground/40">Maersk</span>
            <span className="font-semibold text-foreground/40">CMA CGM</span>
          </div>
        </div>
      </div>
    </section>
  )
}
