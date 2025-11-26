import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/ProductCard'
import { Product } from '@/lib/types'
import { ArrowRight, GameController, Users, ShoppingBag } from '@phosphor-icons/react'

interface HomePageProps {
  featuredProducts: Product[]
  onAddToCart: (product: Product) => void
  onViewDetails: (product: Product) => void
  onNavigate: (page: string) => void
}

export function HomePage({ featuredProducts, onAddToCart, onViewDetails, onNavigate }: HomePageProps) {
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden py-24 md:py-32 bg-black/20 backdrop-blur-sm">
        {/* Dark to transparent gradient overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-transparent"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.h1 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                textShadow: [
                  "0 0 20px rgba(212, 175, 55, 0.3)",
                  "0 0 40px rgba(212, 175, 55, 0.5)",
                  "0 0 20px rgba(212, 175, 55, 0.3)"
                ]
              }}
              transition={{ 
                duration: 1, 
                delay: 0.2,
                textShadow: { duration: 2, repeat: Infinity }
              }}
              className="text-5xl md:text-7xl font-bold mb-6 tracking-tight"
            >
              Welcome to <span className="gradient-text-animated">The Anime Vault</span>
            </motion.h1>
            
            <p className="text-xl md:text-2xl text-white mb-8 leading-relaxed text-enhanced-light">
              Your premier destination for authentic anime merchandise, exclusive collectibles, and the gateway to Otherworlds.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => onNavigate('shop')}
                className="bg-gradient-to-r from-gold via-yellow-400 to-gold text-black hover:from-yellow-400 hover:via-gold hover:to-yellow-400 text-base px-8 h-12 font-bold shadow-lg shadow-gold/50 hover:shadow-xl hover:shadow-gold/70 transition-all duration-300 hover:scale-105"
              >
                <ShoppingBag weight="bold" className="mr-2" />
                Shop Now
                <ArrowRight weight="bold" className="ml-2" />
              </Button>
              
              <Button 
                size="lg"
                onClick={() => onNavigate('game')}
                className="bg-gradient-to-r from-blue-600 via-sky-500 to-blue-600 text-white hover:from-sky-500 hover:via-blue-600 hover:to-sky-500 text-base px-8 h-12 font-bold shadow-lg shadow-blue-500/40 hover:shadow-xl hover:shadow-blue-500/60 transition-all duration-300 hover:scale-105"
              >
                <GameController weight="bold" className="mr-2" />
                Explore Otherworlds
                <ArrowRight weight="bold" className="ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-black/10 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Featured <span className="gradient-text-gold-blue">Collection</span>
            </h2>
            <p className="text-white/90 text-lg max-w-2xl mx-auto font-medium">
              Handpicked treasures for every anime adventurer
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Featured Merch grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
              {featuredProducts.slice(0,4).map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative"
                >
                  <motion.div
                    whileHover={{ scale: 1.05, rotateY: 5, rotateX: 5 }}
                    transition={{ duration: 0.3 }}
                    className="relative overflow-hidden rounded-xl bg-black/20 backdrop-blur-sm border border-gold/20 hover:border-gold/50 transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-gold/0 via-gold/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <ProductCard product={product} onAddToCart={onAddToCart} onViewDetails={onViewDetails} />
                  </motion.div>
                </motion.div>
              ))}
            </div>

            {/* Right: Featured Modpack */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-card border border-border rounded-2xl p-8 flex flex-col justify-between overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-full"></div>
              <div>
                <div className="w-16 h-16 rounded-xl bg-blue-500/15 flex items-center justify-center mb-6 relative z-10">
                  <GameController size={32} weight="bold" className="text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold mb-2">OtherWorlds Awakening</h3>
                <p className="text-sm text-blue-400 mb-4">Minecraft Modpack</p>
                <p className="text-muted-foreground mb-6 leading-relaxed text-sm">
                  Step into a world of magic, machines, and monsters. Built around the Tensura Reincarnated mod and inspired by <em>That Time I Got Reincarnated as a Slime</em>, harness powerful abilities, build thriving colonies with MineColonies, and automate with Create.
                </p>
                <div className="mb-6 rounded-lg overflow-hidden">
                  <img 
                    src="/homepage/modpack.png" 
                    alt="OtherWorlds Awakening Modpack"
                    className="w-full h-32 object-cover"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <a 
                  href="https://www.curseforge.com/minecraft/modpacks/otherworlds-awakening" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button
                    className="w-full bg-gradient-to-r from-blue-600 via-sky-500 to-blue-600 text-white hover:from-sky-500 hover:via-blue-600 hover:to-sky-500"
                  >
                    Download Modpack
                    <ArrowRight weight="bold" className="ml-2" />
                  </Button>
                </a>
                <a 
                  href="https://otherworlds-awakening-webstore.tebex.io/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="outline"
                    className="border-gold/50 text-white hover:border-gold hover:bg-gold/10"
                  >
                    Minecraft Shop
                  </Button>
                </a>
                <Button
                  onClick={() => onNavigate('game')}
                  variant="outline"
                  className="border-blue-500/50 text-white hover:border-blue-400 hover:bg-blue-500/10"
                >
                  Learn More
                </Button>
              </div>
            </motion.div>
          </div>

          <div className="text-center mt-12">
            <Button
              size="lg"
              variant="outline"
              onClick={() => onNavigate('shop')}
              className="border-gold/30 hover:border-gold hover:bg-gold/10"
            >
              View All Products
              <ArrowRight weight="bold" className="ml-2" />
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-gradient-to-b from-background to-primary">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-card border border-border rounded-2xl p-8 hover:border-gold/50 transition-all group"
            >
              <div className="w-16 h-16 rounded-xl bg-gold/10 flex items-center justify-center mb-6 group-hover:bg-gold/20 transition-colors">
                <GameController size={32} weight="bold" className="text-gold" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Otherworlds</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Dive into our original anime-inspired game featuring stunning visuals, immersive gameplay, and a captivating story that will keep you engaged for hours.
              </p>
              <Button
                onClick={() => onNavigate('game')}
                className="bg-gold text-gold-foreground hover:bg-gold/90"
              >
                Learn More
                <ArrowRight weight="bold" className="ml-2" />
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-card border border-border rounded-2xl p-8 hover:border-gold/50 transition-all group"
            >
              <div className="w-16 h-16 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                <Users size={32} weight="bold" className="text-accent" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Join Our Community</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Connect with fellow anime enthusiasts, share your collection, participate in events, and stay updated with the latest releases and exclusive drops.
              </p>
              <Button
                onClick={() => onNavigate('account')}
                variant="outline"
                className="border-accent/30 hover:border-accent hover:bg-accent/10"
              >
                Join Now
                <ArrowRight weight="bold" className="ml-2" />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
