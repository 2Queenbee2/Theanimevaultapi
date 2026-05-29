import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GameController, DownloadSimple, Star, Users, HardDrives, WifiHigh, Trash, Upload, Lock, ShieldCheck, LinkSimple } from '@phosphor-icons/react'

const DISCORD_INVITE = (import.meta as any).env?.VITE_DISCORD_INVITE || 'https://discord.com/invite/'
const OWNER_PASSWORD = 'admin'
const TRAILER_URL = 'https://skilllock.notion.site/?v=47f17ccfecf14b8d8ab4e8beb19a700f&pvs=74'

interface MediaItem { id: string; src: string; title: string }

export function GamePage() {
  const [playerCount, setPlayerCount] = useState<number | string>('Loading...')
  const [serverVersion, setServerVersion] = useState<string>('Loading...')
  const [isOnline, setIsOnline] = useState<boolean | null>(null)
  const [averageRating, setAverageRating] = useState(4.8)
  const [totalRatingsCount, setTotalRatingsCount] = useState(142)
  const [userRating, setUserRating] = useState<number | null>(null)
  const [hoverRating, setHoverRating] = useState<number | null>(null)

  const [mediaItems, setMediaItems] = useKV<MediaItem[]>('game-media-items', [
    { id: '1', src: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=400', title: 'Cosmic Hub' },
    { id: '2', src: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=400', title: 'Boss Arena' },
    { id: '3', src: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=400', title: 'Epic Loot' },
    { id: '4', src: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=400', title: 'Dimensional Gate' },
  ])

  const [isAdminMode, setIsAdminMode] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const [showPasswordPrompt, setShowPasswordInput] = useState(false)
  const [newImageTitle, setNewImageTitle] = useState('')
  const [newImageUrl, setNewImageUrl] = useState('')

  useEffect(() => {
    async function fetchServerStatus() {
      try {
        const res = await fetch('https://api.mcstatus.io/v2/status/java/otherworldsawakening.theanimevault.net')
        if (res.ok) {
          const data = await res.json()
          if (data.online) {
            setPlayerCount(data.players.online)
            setServerVersion(data.version?.name_clean || '1.20.4')
            setIsOnline(true)
          } else {
            setPlayerCount('Offline'); setServerVersion('1.20.x'); setIsOnline(false)
          }
        } else {
          setPlayerCount('Offline'); setIsOnline(false)
        }
      } catch {
        setPlayerCount('Offline'); setIsOnline(false)
      }
    }
    fetchServerStatus()
    const interval = setInterval(fetchServerStatus, 60000)
    return () => clearInterval(interval)
  }, [])

  const handleRate = (clickedRating: number) => {
    if (userRating !== null) return
    setUserRating(clickedRating)
    const newCount = totalRatingsCount + 1
    const newAverage = ((averageRating * totalRatingsCount) + clickedRating) / newCount
    setAverageRating(Number(newAverage.toFixed(1)))
    setTotalRatingsCount(newCount)
  }

  const handleVerifyPassword = (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordInput === OWNER_PASSWORD) {
      setIsAdminMode(true); setShowPasswordInput(false); setPasswordInput('')
    } else {
      alert('Incorrect Password!')
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      const newItem: MediaItem = { id: Date.now().toString(), src: reader.result as string, title: newImageTitle || file.name.split('.')[0] }
      setMediaItems((prev: MediaItem[] = []) => [...prev, newItem])
      setNewImageTitle('')
    }
    reader.readAsDataURL(file)
  }

  const handleAddImageUrl = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newImageUrl) return
    const newItem: MediaItem = { id: Date.now().toString(), src: newImageUrl, title: newImageTitle || 'Custom Image' }
    setMediaItems((prev: MediaItem[] = []) => [...prev, newItem])
    setNewImageTitle(''); setNewImageUrl('')
  }

  const handleDeleteImage = (id: string) => {
    if (confirm('Are you sure you want to delete this image?')) {
      setMediaItems((prev: MediaItem[] = []) => prev.filter(item => item.id !== id))
    }
  }

  return (
    <div className="min-h-screen py-12 bg-black/20 backdrop-blur-sm">
      <div className="container mx-auto px-6">
        
        {/* Hero Section */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-bold uppercase tracking-wider">
              <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
              Server {isOnline ? 'Online' : 'Offline'}
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
              <span className="gradient-text-animated block">Otherworlds</span>
              <span className="text-white text-3xl md:text-4xl mt-2 block">Awakening</span>
            </h1>
            <p className="text-lg text-white/80 leading-relaxed">
              Dive into the ultimate anime-inspired Minecraft MMORPG experience. Command legendary power, embark on dimensional quests, customize custom weapons, and fight side-by-side with an active, welcoming community.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <a href={DISCORD_INVITE} target="_blank" rel="noopener noreferrer">
                <Button className="h-12 px-8 bg-gradient-to-r from-gold to-yellow-400 text-black font-bold text-md shadow-lg">
                  <GameController size={20} className="mr-2" /> Join Discord
                </Button>
              </a>
              <Button variant="outline" onClick={() => { navigator.clipboard.writeText('otherworldsawakening.theanimevault.net'); alert('Server IP copied!') }} className="h-12 px-8 border-gold/30 text-white hover:bg-gold/10 font-bold">
                <DownloadSimple size={20} className="mr-2" /> Copy Server IP
              </Button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full">
            <a href={TRAILER_URL} target="_blank" rel="noopener noreferrer" className="block relative aspect-video rounded-2xl overflow-hidden border border-gold/30 shadow-2xl group cursor-pointer">
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-2 group-hover:bg-black/20 transition-all duration-300 z-10">
                <div className="w-16 h-16 rounded-full bg-gold/90 text-black flex items-center justify-center shadow-lg group-hover:scale-110 transition-all">
                  <LinkSimple size={24} weight="bold" />
                </div>
                <span className="text-white text-xs font-bold uppercase tracking-widest mt-1 bg-black/60 border border-gold/20 px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">Visit Notion Guide</span>
              </div>
            <img src="/gamers-cover.png.png" alt="Click to visit Notion page" className="w-full h-full object-cover" />
          </motion.div>
        </div>

        {/* Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
          <Card className="p-6 bg-black/40 border-gold/20 flex flex-col justify-between hover:border-gold/40 transition-all">
            <div>
              <h3 className="text-white/60 text-sm font-semibold uppercase mb-2">Player Rating</h3>
              <div className="flex items-baseline gap-2"><span className="text-4xl font-extrabold text-white">{averageRating}</span><span className="text-lg text-white/55">/ 5</span></div>
            </div>
            <div className="mt-4 pt-4 border-t border-gold/10">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} disabled={userRating !== null} onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(null)} onClick={() => handleRate(star)} className="focus:outline-none transition-transform active:scale-125">
                    <Star size={24} weight={(hoverRating !== null ? star <= hoverRating : star <= (userRating ?? Math.round(averageRating))) ? 'fill' : 'regular'} className={(hoverRating !== null ? star <= hoverRating : star <= (userRating ?? Math.round(averageRating))) ? 'text-gold' : 'text-white/30'} />
                  </button>
                ))}
              </div>
              <p className="text-xs text-white/50 mt-2">{userRating !== null ? `Thanks! (${totalRatingsCount} votes)` : `Click stars to rate (${totalRatingsCount} votes)`}</p>
            </div>
          </Card>

          <Card className="p-6 bg-black/40 border-gold/20 flex flex-col justify-between hover:border-gold/40 transition-all">
            <div>
              <h3 className="text-white/60 text-sm font-semibold uppercase mb-2">Active Players</h3>
              <div className="flex items-center gap-3"><span className="text-4xl font-extrabold text-white">{playerCount}</span>{isOnline && <span className="flex h-3 w-3 rounded-full bg-green-500 animate-ping"></span>}</div>
            </div>
            <div className="mt-4 pt-4 border-t border-gold/10 flex items-center gap-2 text-gold"><Users size={20} /><p className="text-xs text-white/70">otherworldsawakening.theanimevault.net</p></div>
          </Card>

          <Card className="p-6 bg-black/40 border-gold/20 flex flex-col justify-between hover:border-gold/40 transition-all">
            <div>
              <h3 className="text-white/60 text-sm font-semibold uppercase mb-2">Server Details</h3>
              <div className="text-2xl font-bold text-white flex items-center gap-2"><WifiHigh size={24} className="text-gold" /><span>{serverVersion}</span></div>
            </div>
            <div className="mt-4 pt-4 border-t border-gold/10 flex items-center gap-2 text-gold"><HardDrives size={20} /><p className="text-xs text-white/70">Optimized hardware</p></div>
          </Card>
        </div>

        {/* Tabs */}
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto bg-black/50 border border-gold/20 rounded-xl p-1 mb-8">
              <TabsTrigger value="overview" className="data-[state=active]:bg-gold data-[state=active]:text-black rounded-lg text-sm font-bold py-2">Overview</TabsTrigger>
              <TabsTrigger value="features" className="data-[state=active]:bg-gold data-[state=active]:text-black rounded-lg text-sm font-bold py-2">Features</TabsTrigger>
              <TabsTrigger value="media" className="data-[state=active]:bg-gold data-[state=active]:text-black rounded-lg text-sm font-bold py-2">Media</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <Card className="p-8 bg-black/40 border-gold/20">
                <h2 className="text-3xl font-extrabold gradient-text-primary mb-6">About the Server</h2>
                <div className="space-y-6 text-white/80 leading-relaxed text-md">
                  <p>Step into a world of magic, machines, and monsters in this expansive adventure mod pack built around the <span className="text-gold font-bold">Tensura Reincarnated</span> mod. Inspired by the world of <span className="text-gold/90 italic">That Time I Got Reincarnated as a Slime</span>, you’ll harness powerful abilities, evolve through unique skills, and carve your path as a ruler, warrior, or mage.</p>
                  <p>Paired with the engineering marvels of <span className="text-gold font-bold">Create</span> and the structured world of <span className="text-gold font-bold">Survive the Bosses of Calamity</span>, you’ll build thriving communities, automate complex systems, and watch your empire grow. Dive deep into a rich variety of trade mods, each offering its own system and progression paths to master.</p>
                  <p>Designed for explorers and builders alike, this pack is loaded with adventure quests and challenges that will guide you through every aspect of gameplay—from survival and combat to colony management and magical domination.</p>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="features">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { title: 'Custom Cosmetics', desc: "Deck out your character with custom armor, weapons, tools & more — because standing out is the whole point." },
                  { title: 'Dynamic Boss Encounters', desc: "Face legendary bosses from Bosses Rise & Tensura — epic, brutal, and nothing like anything you've fought before." },
                  { title: 'Choose your battle', desc: "Your world, your rules — toggle PvP or PvE instantly with a quick command. Fight others or go solo, the choice is yours." },
                  { title: 'Spellcasting & Skills', desc: "Master powerful spells with Iron's Spells & Spellbooks — then unlock your true potential through a custom skill system tied to your race and evolution. Your power is earned, not given." },
                  { title: 'Guilds and Homes', desc: "Build your legacy — form powerful guilds, rise through the ranks, and claim your own rentable home. Every empire starts somewhere." },
                  { title: 'Fully Custom Economy', desc: 'Trade, complete quests, manage shops, and purchase ranks via our unified shop!' }
                ].map((feature, i) => (
                  <Card key={i} className="p-6 bg-black/40 border border-gold/20 hover:border-gold/50 transition-all">
                    <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-sm text-white/70 leading-relaxed">{feature.desc}</p>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="media" className="space-y-6">
              <Card className="p-5 bg-black/60 border border-gold/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold/10 text-gold flex items-center justify-center border border-gold/20">{isAdminMode ? <ShieldCheck size={20} /> : <Lock size={20} />}</div>
                  <div>
                    <h4 className="font-bold text-white">Server Owner Panel</h4>
                    <p className="text-xs text-white/50">{isAdminMode ? 'Admin mode active. Upload and delete media items!' : 'Unlock image uploader and delete controls.'}</p>
                  </div>
                </div>
                {!isAdminMode ? (
                  !showPasswordPrompt ? (
                    <Button onClick={() => setShowPasswordInput(true)} className="bg-gold/20 border border-gold/30 text-white text-xs">Enter Owner Mode</Button>
                  ) : (
                    <form onSubmit={handleVerifyPassword} className="flex gap-2 w-full md:w-auto">
                      <Input type="password" placeholder="Password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} className="bg-black border border-gold/20 text-xs max-w-[120px]" />
                      <Button type="submit" className="bg-gold text-black text-xs font-bold px-3">Unlock</Button>
                      <Button type="button" onClick={() => setShowPasswordInput(false)} className="bg-red-500/20 text-white text-xs px-2">Cancel</Button>
                    </form>
                  )
                ) : (
                  <Button onClick={() => setIsAdminMode(false)} className="bg-red-500/20 text-red-300 border border-red-500/30 text-xs">Lock Owner Mode</Button>
                )}
              </Card>

              {isAdminMode && (
                <Card className="p-6 bg-black/50 border border-gold/30 space-y-4">
                  <h3 className="text-lg font-bold text-gold">Upload New Server Photo</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 border border-gold/10 p-4 rounded-lg bg-black/20 flex flex-col justify-between">
                      <div>
                        <span className="text-xs text-gold uppercase font-bold block mb-1">Upload from Device</span>
                        <p className="text-xs text-white/50 mb-3">Add image files from your computer.</p>
                      </div>
                      <div className="space-y-3">
                        <Input placeholder="Image Caption/Title" value={newImageTitle} onChange={(e) => setNewImageTitle(e.target.value)} className="bg-black border border-gold/20 text-xs" />
                        <div className="relative">
                          <input type="file" accept="image/*" id="file-upload" onChange={handleFileUpload} className="hidden" />
                          <label htmlFor="file-upload" className="flex items-center justify-center gap-2 w-full h-10 bg-gold text-black text-xs font-bold rounded-lg cursor-pointer">
                            <Upload size={16} /> Choose File
                          </label>
                        </div>
                      </div>
                    </div>
                    <form onSubmit={handleAddImageUrl} className="space-y-2 border border-gold/10 p-4 rounded-lg bg-black/20 flex flex-col justify-between">
                      <div>
                        <span className="text-xs text-gold uppercase font-bold block mb-1">Add via Image Link</span>
                        <p className="text-xs text-white/50 mb-3">Paste a direct web link to an online image.</p>
                      </div>
                      <div className="space-y-3">
                        <Input placeholder="Image Caption/Title" value={newImageTitle} onChange={(e) => setNewImageTitle(e.target.value)} className="bg-black border border-gold/20 text-xs" />
                        <div className="flex gap-2">
                          <Input placeholder="https://example.com/image.jpg" value={newImageUrl} onChange={(e) => setNewImageUrl(e.target.value)} className="bg-black border border-gold/20 text-xs flex-1" />
                          <Button type="submit" className="bg-gold text-black text-xs font-bold">Add</Button>
                        </div>
                      </div>
                    </form>
                  </div>
                </Card>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {(mediaItems || []).map((media) => (
                  <div key={media.id} className="relative aspect-square rounded-xl overflow-hidden border border-gold/20 group shadow-lg">
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent opacity-60 z-10" />
                    <img src={media.src} alt={media.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute bottom-4 left-4 z-20 pr-10">
                      <span className="text-[10px] text-gold uppercase font-bold">Screenshot</span>
                      <h4 className="text-sm font-bold text-white mt-0.5 line-clamp-1">{media.title}</h4>
                    </div>
                    {isAdminMode && (
                      <Button variant="destructive" size="icon" onClick={() => handleDeleteImage(media.id)} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-600 hover:bg-red-500 text-white z-30 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash size={16} />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Call to Action */}
        <div className="max-w-4xl mx-auto mt-20 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">Ready to Begin Your Adventure?</h2>
          <p className="text-md text-white/70 max-w-lg mx-auto leading-relaxed">Join thousands of adventurers in the ever-expanding world of Otherworlds. Complete quests, dominate factions, and forge your legend.</p>
          <div className="pt-2">
            <a href={DISCORD_INVITE} target="_blank" rel="noopener noreferrer">
              <Button className="h-12 px-8 bg-gradient-to-r from-gold to-yellow-400 text-black font-bold">Join Us Today</Button>
            </a>
          </div>
        </div>

      </div>
    </div>
  )
}
