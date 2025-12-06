"use client"

export function Footer() {
  return (
    <footer className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Flare-colored accent bar */}
        <div className="h-2 bg-gradient-to-r from-primary via-secondary to-primary rounded-full mb-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary neo-border-sm rounded-lg flex items-center justify-center">
              <span className="font-bold text-primary-foreground">IP</span>
            </div>
            <span className="text-xl font-bold">InfoPilot</span>
          </div>

          <p className="text-muted-foreground text-center">
            Built on <span className="text-primary font-semibold">Flare Network</span> — The blockchain for data
          </p>

          <div className="flex items-center gap-4">
            <a href="#" className="neo-button px-4 py-2 bg-card rounded-lg text-sm font-medium hover:bg-primary/10">
              GitHub
            </a>
            <a href="#" className="neo-button px-4 py-2 bg-card rounded-lg text-sm font-medium hover:bg-primary/10">
              Docs
            </a>
            <a href="#" className="neo-button px-4 py-2 bg-card rounded-lg text-sm font-medium hover:bg-primary/10">
              Twitter
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t-2 border-border text-center text-sm text-muted-foreground">
          © 2025 InfoPilot. Open source under MIT License.
        </div>
      </div>
    </footer>
  )
}
