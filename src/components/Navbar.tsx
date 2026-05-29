import { ShoppingCart, List, X } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import logoImage from '@/assets/logo/New Logo.png'

interface NavbarProps {
  cartCount: number
  onCartClick: () => void
  currentPage: string
  onNavigate: (page: string) => void
}

export function Navbar({ cartCount, onCartClick, currentPage, onNavigate }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { label: 'Home', value: 'home' },
    { label: 'Shop', value: 'shop' },
     { label: 'Minecraft Shop', value: 'minecraft-shop' },
    { label: 'Checkout', value: 'checkout' },
    { label: 'Gamers Corner', value: 'game' },
    { label: 'My Account', value: 'account' }
  ]



  return (
    <nav className="sticky top-0 z-50 border-b-2 border-gradient-to-r from-gold via-blue-500 to-gold bg-gradient-to-r from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl shadow-2xl transition-all duration-300">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 group"
          >
            <img 
              src={logoImage} 
              alt="The Anime Vault Logo" 
              className="w-12 h-12 object-contain object-bottom rounded-full group-hover:scale-105 transition-transform shadow-lg shadow-gold/30 translate-y-[2px]"
            />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-foreground group-hover:text-gold transition-colors">
                The Anime Vault
              </span>
            </div>
          </button>

          <div className="hidden md:flex items-center gap-3">
            {navItems.map((item) => (
              <Button
                key={item.value}
                variant="ghost"
                onClick={() => onNavigate(item.value)}
                className={cn(
                  'text-base font-bold transition-all duration-300 px-6 py-3 rounded-xl border-2 relative overflow-hidden group',
                  currentPage === item.value
                    ? 'bg-gradient-to-r from-gold via-yellow-400 to-gold text-black border-gold shadow-lg shadow-gold/50 scale-105'
                    : 'text-white border-blue-500/50 hover:border-gold hover:text-black hover:bg-gradient-to-r hover:from-gold hover:via-yellow-400 hover:to-gold hover:scale-105 hover:shadow-lg hover:shadow-gold/30'
                )}
              >
                <span className="relative z-10">{item.label}</span>
                {currentPage !== item.value && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent transform -skew-x-12 group-hover:animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gold to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 shadow-lg shadow-gold/50"></div>
                  </>
                )}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={onCartClick}
              className="relative border-gold/20 hover:border-gold hover:bg-gold/10"
            >
              <ShoppingCart className="text-gold" weight="bold" />
              {cartCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-gold text-gold-foreground">
                  {cartCount}
                </Badge>
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden"
            >
              {mobileMenuOpen ? <X weight="bold" /> : <List weight="bold" />}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 flex flex-col gap-2 border-t border-border pt-4">
            {navItems.map((item) => (
              <Button
                key={item.value}
                variant="ghost"
                onClick={() => {
                  onNavigate(item.value)
                  setMobileMenuOpen(false)
                }}
                className={cn(
                  'justify-start text-base font-medium',
                  currentPage === item.value
                    ? 'text-gold bg-gold/10'
                    : 'text-muted-foreground'
                )}
              >
                {item.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
