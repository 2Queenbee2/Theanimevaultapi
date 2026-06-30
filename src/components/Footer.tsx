import { DiscordLogo, TwitterLogo, InstagramLogo, YoutubeLogo, EnvelopeSimple } from '@phosphor-icons/react'
import logoImage from '@/assets/logo/New Logo.png'

export function Footer() {
  return (
    <footer className="border-t border-border bg-black/40 backdrop-blur-md mt-auto">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img 
                src={logoImage} 
                alt="The Anime Vault Logo" 
                className="w-10 h-10 object-cover rounded-full shadow-md shadow-gold/20"
              />
              <span className="font-bold text-lg">The Anime Vault</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your premier destination for authentic anime merchandise, community, and experiences.
            </p>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Company</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <button 
                  onClick={() => {
                    const modal = document.getElementById('about-modal')
                    if (modal) modal.style.display = 'flex'
                  }}
                  className="hover:text-gold cursor-pointer transition-colors text-left"
                >
                  About Us
                </button>
              </li>
              <li>
                <a href="https://discord.gg/HZ33WY4RdH" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">
                  Community Discord
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Contact Us</h3>
            <div className="space-y-3">
              <a 
                href="mailto:theanimevault.official2025@gmail.com"
                className="flex items-center gap-3 text-sm text-white hover:text-gold transition-colors"
              >
                <EnvelopeSimple size={18} className="text-gold shrink-0" />
                theanimevault.official2025@gmail.com
              </a>
              <a 
                href="https://discord.gg/HZ33WY4RdH" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-white hover:text-gold transition-colors"
              >
                <DiscordLogo size={18} className="text-indigo-400 shrink-0" />
                discord.gg/HZ33WY4RdH
              </a>
            </div>

            {/* Social Icons */}
            <div className="flex gap-3 pt-2">
              <a href="https://discord.gg/HZ33WY4RdH" target="_blank" rel="noopener noreferrer">
                <button className="w-9 h-9 rounded-lg bg-secondary hover:bg-indigo-500/20 hover:text-indigo-400 transition-all flex items-center justify-center">
                  <DiscordLogo size={18} weight="fill" />
                </button>
              </a>
              <button className="w-9 h-9 rounded-lg bg-secondary hover:bg-sky-500/20 hover:text-sky-400 transition-all flex items-center justify-center">
                <TwitterLogo size={18} weight="fill" />
              </button>
              <button className="w-9 h-9 rounded-lg bg-secondary hover:bg-pink-500/20 hover:text-pink-400 transition-all flex items-center justify-center">
                <InstagramLogo size={18} weight="fill" />
              </button>
              <button className="w-9 h-9 rounded-lg bg-secondary hover:bg-red-500/20 hover:text-red-400 transition-all flex items-center justify-center">
                <YoutubeLogo size={18} weight="fill" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>© 2025 The Anime Vault™. All rights reserved.</p>
          <p>The Anime Vault™ and OtherWorlds Awakening™ are trademarks of The Anime Vault.</p>
        </div>
      </div>

      {/* About Us Modal */}
      <div 
        id="about-modal"
        style={{ display: 'none' }}
        className="fixed inset-0 z-50 items-center justify-center bg-black/70 backdrop-blur-sm p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            const modal = document.getElementById('about-modal')
            if (modal) modal.style.display = 'none'
          }
        }}
      >
        <div className="bg-card border border-gold/20 rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold gradient-text-primary">About The Anime Vault</h2>
            <button 
              onClick={() => {
                const modal = document.getElementById('about-modal')
                if (modal) modal.style.display = 'none'
              }}
              className="text-white/50 hover:text-white text-2xl"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p>Anime is more than entertainment—it's art, storytelling, and a culture that brings millions of people together. <span className="text-white font-medium">The Anime Vault was built to celebrate that passion.</span></p>
            <p>We're creating a destination where anime fans can discover premium merchandise inspired by the worlds they love, while becoming part of a community that values creativity, quality, and authenticity.</p>
            <p>Quality comes first. From the materials we choose to the designs we create and the experience we deliver, every detail matters.</p>
            <p className="text-white font-medium">But The Anime Vault is more than a store.</p>
            <p>We're building an anime ecosystem where fans can connect beyond shopping through our Discord community, events, giveaways, and our custom Minecraft server.</p>

            <div className="border-t border-gold/20 pt-4">
              <h3 className="text-white font-bold mb-3">Our Vision</h3>
              <p>To become a trusted home for anime fans by combining exceptional merchandise, engaging communities, and unique experiences into one connected destination.</p>
            </div>

            <div className="border-t border-gold/20 pt-4">
              <h3 className="text-white font-bold mb-3">What We Stand For</h3>
              <ul className="space-y-2">
                <li><span className="text-gold font-medium">Quality Without Compromise</span> — Every product should meet a standard we're proud to put our name on.</li>
                <li><span className="text-gold font-medium">Built for Fans</span> — Everything we create begins with a genuine appreciation for anime.</li>
                <li><span className="text-gold font-medium">Community at Our Core</span> — Whether shopping, chatting in Discord, or exploring our Minecraft server, you're part of The Anime Vault.</li>
                <li><span className="text-gold font-medium">Always Evolving</span> — Anime never stands still, and neither do we.</li>
              </ul>
            </div>

            <div className="border-t border-gold/20 pt-4 text-center">
              <p className="text-white font-bold text-lg">Welcome to The Anime Vault.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
