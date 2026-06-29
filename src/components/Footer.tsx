import { DiscordLogo, TwitterLogo, InstagramLogo, YoutubeLogo, EnvelopeSimple } from '@phosphor-icons/react'
import logoImage from '@/assets/logo/New Logo.png'

const ABOUT_US = `Anime is more than entertainment—it's art, storytelling, and a culture that brings millions of people together. The Anime Vault was built to celebrate that passion.

We're creating a destination where anime fans can discover premium merchandise inspired by the worlds they love, while becoming part of a community that values creativity, quality, and authenticity.

Quality comes first. From the materials we choose to the designs we create and the experience we deliver, every detail matters.

But The Anime Vault is more than a store. We're building an anime ecosystem where fans can connect beyond shopping through our Discord community, events, giveaways, and our custom Minecraft server.`

export function Footer() {
  return (
    <footer className="border-t border-border bg-black/40 backdrop-blur-md mt-auto">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
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

          {/* Shop */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Shop</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="/shop" className="hover:text-gold cursor-pointer transition-colors">Posters</a>
              </li>
              <li>
                <a href="/shop" className="hover:text-gold cursor-pointer transition-colors">Apparel</a>
              </li>
              <li>
                <a href="/shop" className="hover:text-gold cursor-pointer transition-colors">Accessories</a>
              </li>
              <li>
                <a href="/shop" className="hover:text-gold cursor-pointer transition-colors">Playmats & Mouse Pads</a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
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
                <a href="#game" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('navigate', { detail: 'game' })) }} className="hover:text-gold cursor-pointer transition-colors">
                  Otherworlds Game
                </a>
              </li>
              <li>
                <a href="https://discord.gg/HZ33WY4RdH" target="_blank" rel="noopener noreferrer" className="hover:text-gold cursor-pointer transition-colors">
                  Community
                </a>
              </li>
              <li>
                <a href="mailto:theanimevault.official2025@gmail.com" className="hover:text-gold cursor-pointer transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Connect</h3>
            <div className="flex gap-3">
              <a href="https://discord.gg/HZ33WY4RdH" target="_blank" rel="noopener noreferrer">
                <button className="w-10 h-10 rounded-lg bg-secondary hover:bg-gold/20 hover:text-gold transition-all flex items-center justify-center">
                  <DiscordLogo size={20} weight="fill" />
                </button>
              </a>
              <button className="w-10 h-10 rounded-lg bg-secondary hover:bg-gold/20 hover:text-gold transition-all flex items-center justify-center">
                <TwitterLogo size={20} weight="fill" />
              </button>
              <button className="w-10 h-10 rounded-lg bg-secondary hover:bg-gold/20 hover:text-gold transition-all flex items-center justify-center">
                <InstagramLogo size={20} weight="fill" />
              </button>
              <button className="w-10 h-10 rounded-lg bg-secondary hover:bg-gold/20 hover:text-gold transition-all flex items-center justify-center">
                <YoutubeLogo size={20} weight="fill" />
              </button>
              <a href="mailto:theanimevault.official2025@gmail.com">
                <button className="w-10 h-10 rounded-lg bg-secondary hover:bg-gold/20 hover:text-gold transition-all flex items-center justify-center">
                  <EnvelopeSimple size={20} weight="fill" />
                </button>
              </a>
            </div>
            <p className="text-sm text-muted-foreground">
              <a href="mailto:theanimevault.official2025@gmail.com" className="hover:text-gold transition-colors">
                theanimevault.official2025@gmail.com
              </a>
            </p>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© 2025 The Anime Vault. All rights reserved.</p>
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
            
            <p>We're creating a destination where anime fans can discover premium merchandise inspired by the worlds they love, while becoming part of a community that values creativity, quality, and authenticity. Every collection we release is guided by a simple philosophy: create products that fans are genuinely excited to own—not just another item on a shelf.</p>
            
            <p>Quality comes first. From the materials we choose to the designs we create and the experience we deliver, every detail matters. We believe anime merchandise should feel meaningful—something that reflects the stories, characters, and moments that inspire us.</p>
            
            <p className="text-white font-medium">But The Anime Vault is more than a store.</p>
            
            <p>We're building an anime ecosystem where fans can connect beyond shopping. Our Discord community brings together collectors, creators, gamers, and anime enthusiasts from around the world through discussions, events, giveaways, and exclusive community experiences.</p>

            <div className="border-t border-gold/20 pt-4 mt-4">
              <h3 className="text-white font-bold mb-3">Our Vision</h3>
              <p>To become a trusted home for anime fans by combining exceptional merchandise, engaging communities, and unique experiences into one connected destination.</p>
            </div>

            <div className="border-t border-gold/20 pt-4">
              <h3 className="text-white font-bold mb-3">What We Stand For</h3>
              <ul className="space-y-2">
                <li><span className="text-gold font-medium">Quality Without Compromise</span> — Every product should meet a standard we're proud to put our name on.</li>
                <li><span className="text-gold font-medium">Built for Fans</span> — Everything we create begins with a genuine appreciation for anime and the people who love it.</li>
                <li><span className="text-gold font-medium">Community at Our Core</span> — Whether you're shopping, chatting in Discord, or exploring our Minecraft server, you're part of The Anime Vault.</li>
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
