export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold">▢</span>
              </div>
              <span className="font-bold text-foreground">Container Reuse</span>
            </div>
            <p className="text-foreground/60 text-sm">Logistics bền vững cho tương lai</p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Sản phẩm</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-foreground/60 hover:text-primary transition-colors">
                  Tính năng
                </a>
              </li>
              <li>
                <a href="#" className="text-foreground/60 hover:text-primary transition-colors">
                  Giá cả
                </a>
              </li>
              <li>
                <a href="#" className="text-foreground/60 hover:text-primary transition-colors">
                  Bảo mật
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Công ty</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-foreground/60 hover:text-primary transition-colors">
                  Về chúng tôi
                </a>
              </li>
              <li>
                <a href="#" className="text-foreground/60 hover:text-primary transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-foreground/60 hover:text-primary transition-colors">
                  Liên hệ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Pháp lý</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-foreground/60 hover:text-primary transition-colors">
                  Điều khoản
                </a>
              </li>
              <li>
                <a href="#" className="text-foreground/60 hover:text-primary transition-colors">
                  Riêng tư
                </a>
              </li>
              <li>
                <a href="#" className="text-foreground/60 hover:text-primary transition-colors">
                  Cookie
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/30 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-foreground/50 text-sm">© {currentYear} Container Reuse. Tất cả quyền được bảo lưu.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="text-foreground/50 hover:text-primary transition-colors">
              Twitter
            </a>
            <a href="#" className="text-foreground/50 hover:text-primary transition-colors">
              LinkedIn
            </a>
            <a href="#" className="text-foreground/50 hover:text-primary transition-colors">
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
