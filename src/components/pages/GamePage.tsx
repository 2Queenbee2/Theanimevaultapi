import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GameController, DownloadSimple, Star, Users, HardDrives, WifiHigh, Trash, Upload, Lock, ShieldCheck } from '@phosphor-icons/react'

const DISCORD_INVITE = (import.meta as any).env?.VITE_DISCORD_INVITE || 'https://discord.com/invite/'
const OWNER_PASSWORD = 'admin' // Feel free to change this password to whatever you want!

interface MediaItem {
  id: string
  src: string
  title: string
}

export function GamePage() {
  // --- Minecraft Live Server Status State ---
  const [playerCount, setPlayerCount] = useState<number | string>('Loading...')
  const [serverVersion, setServerVersion] = useState<string>('Loading...')
  const [isOnline, setIsOnline] = useState<boolean | null>(null)

  // --- Interactive Star Rating State ---
  const [averageRating, setAverageRating] = useState(4.8)
  const [totalRatingsCount, setTotalRatingsCount] = useState(142)
  const [userRating, setUserRating] = useState<number | null>(null)
  const [hoverRating, setHoverRating] = useState<number | null>(null)

  // --- Persistent Media State using Spark KV ---
  const [mediaItems, setMediaItems] = useKV<MediaItem[]>('game-media-items', [
    { id: '1', src: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=400', title: 'Cosmic Hub' },
    { id: '2', src: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=400', title: 'Boss Arena' },
    { id: '3', src: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=400', title: 'Epic Loot' },
    { id: '4', src: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=400', title: 'Dimensional Gate' },
  ])

  // --- Owner/Admin Controls State ---
  const [isAdminMode, setIsAdminMode] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const [showPasswordPrompt, setShowPasswordInput] = useState(false)
  const [newImageTitle, setNewImageTitle] = useState('')
  const [newImageUrl, setNewImageUrl] = useState('')

  // Fetch Live Minecraft Server Status
  useEffect(() => {
    async function fetchServerStatus() {
      try {
        const response = await fetch('https://api.mcstatus.io/v2/status/java/otherworldsawakening.theanimevault.net')
        if (response.ok) {
          const data = await response.json()
          if (data.online) {
            setPlayerCount(data.players.online)
            setServerVersion(data.version?.name_clean || '1.20.4')
            setIsOnline(true)
          } else {
            setPlayerCount('Offline')
            setServerVersion('1.20.x')
            setIsOnline(false)
          }
        } else {
          setPlayerCount('Offline')
          setIsOnline(false)
        }
      } catch (err) {
        console.error('Error fetching server status:', err)
        setPlayerCount('Offline')
        setIsOnline(false)
      }
    }

    fetchServerStatus()
    const interval = setInterval(fetchServerStatus, 60000)
    return () => clearInterval(interval)
  }, [])

  // Handle rating click
  const handleRate = (clickedRating: number) => {
    if (userRating !== null) return

    setUserRating(clickedRating)
    const newTotalCount = totalRatingsCount + 1
    const newAverage = ((averageRating * totalRatingsCount) + clickedRating) / newTotalCount
    setAverageRating(Number(newAverage.toFixed(1)))
    setTotalRatingsCount(newTotalCount)
  }

  // --- Owner/Media Functions ---
  const handleVerifyPassword = (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordInput === OWNER_PASSWORD) {
      setIsAdminMode(true)
      setShowPasswordInput(false)
      setPasswordInput('')
    } else {
      alert('Incorrect Password!')
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      const base64String = reader.result as string
      const newItem: MediaItem = {
        id: Date.now().toString(),
        src: base64String,
        title: newImageTitle || file.name.split('.')[0]
      }
      setMediaItems((prev: MediaItem[] = []) => [...prev, newItem])
      setNewImageTitle('')
    }
    reader.readAsDataURL(file)
  }

  const handleAddImageUrl = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newImageUrl) return
    const newItem: MediaItem = {
      id: Date.now().toString(),
      src: newImageUrl,
      title: newImageTitle || 'Custom Image'
    }
    setMediaItems((prev: MediaItem[] = []) => [...prev, newItem])
    setNewImageTitle('')
    setNewImageUrl('')
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
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-bold uppercase tracking-wider">
              <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
              Server {isOnline ? 'Online' : 'Offline'}
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
              <span className="gradient-text-animated block">Otherworlds</span>
              <span className="text-white text-3xl md:text-4xl mt-2 block">Awakening</span>
            </h1>

            <p className="text-lg text-white/80 leading-relaxed text-enhanced-light">
              Dive into the ultimate anime-inspired Minecraft MMORPG experience. Command legendary power, embark on dimensional quests, customize custom weapons, and fight side-by-side with an active, welcoming community on the official `otherworldsawakening` domain.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <a href={DISCORD_INVITE} target="_blank" rel="noopener noreferrer">
                <Button className="h-12 px-8 bg-gradient-to-r from-gold to-yellow-400 hover:from-yellow-400 hover:to-gold text-black font-bold text-md shadow-lg shadow-gold/30">
                  <GameController size={20} className="mr-2" />
                  Join Discord
                </Button>
              </a>

              <Button 
                variant="outline" 
                onClick={() => {
                  navigator.clipboard.writeText('otherworldsawakening.theanimevault.net')
                  alert('Server IP copied to clipboard!')
                }}
                className="h-12 px-8 border-gold/30 text-white hover:bg-gold/10 hover:border-gold font-bold"
              >
                <DownloadSimple size={20} className="mr-2" />
                Copy Server IP
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative aspect-video rounded-2xl overflow-hidden border border-gold/30 shadow-2xl shadow-gold/10 group"
          >
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-all duration-300">
              <div className="w-16 h-16 rounded-full bg-gold/90 text-black flex items-center justify-center shadow-lg group-hover:scale-110 transition-all cursor-pointer">
                <span className="text-xl ml-1">▶</span>
              </div>
            </div>
            <img 
              src="https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200" 
              alt="Otherworlds Trailer Thumbnail" 
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>

        {/* Live Counters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
          {/* Card 1: Interactive Rating Card */}
          <Card className="p-6 bg-black/40 backdrop-blur-sm border-gold/20 flex flex-col justify-between hover:border-gold/40 transition-all duration-300">
            <div>
              <h3 className="text-white/60 text-sm font-semibold uppercase tracking-wider mb-2">Player Rating</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-white">{averageRating}</span>
                <span className="text-lg text-white/55">/ 5</span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gold/10">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    disabled={userRating !== null}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    onClick={() => handleRate(star)}
                    className="focus:outline-none transition-transform active:scale-125 disabled:cursor-default"
                  >
                    <Star
                      size={24}
                      weight={(hoverRating !== null ? star <= hoverRating : star <= (userRating ?? Math.round(averageRating))) ? 'fill' : 'regular'}
                      className={(hoverRating !== null ? star <= hoverRating : star <= (userRating ?? Math.round(averageRating))) ? 'text-gold' : 'text-white/30'}
                    />
                  </button>
                ))}
              </div>
              <p className="text-xs text-white/50 mt-2">
                {userRating !== null 
                  ? `Thanks for your rating! (${totalRatingsCount} total votes)` 
                  : `Click stars to rate (${totalRatingsCount} total votes)`}
              </p>
            </div>
          </Card>

          {/* Card 2: Live Players Card */}
          <Card className="p-6 bg-black/40 backdrop-blur-sm border-gold/20 flex flex-col justify-between hover:border-gold/40 transition-all duration-300">
            <div>
              <h3 className="text-white/60 text-sm font-semibold uppercase tracking-wider mb-2">Active Players</h3>
              <div className="flex items-center gap-3">
                <span className="text-4xl font-extrabold text-white">{playerCount}</span>
                {isOnline && <span className="flex h-3 w-3 rounded-full bg-green-500 animate-ping"></span>}
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gold/10 flex items-center gap-2 text-gold">
              <Users size={20} />
              <p className="text-xs text-white/70">Connect at otherworldsawakening.theanimevault.net</p>
            </div>
          </Card>

          {/* Card 3: Dynamic Server Info Card */}
          <Card className="p-6 bg-black/40 backdrop-blur-sm border-gold/20 flex flex-col justify-between hover:border-gold/40 transition-all duration-300">
            <div>
              <h3 className="text-white/60 text-sm font-semibold uppercase tracking-wider mb-2">Server Details</h3>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-white flex items-center gap-2">
                  <WifiHigh size={24} className="text-gold" />
                  <span>{serverVersion}</span>
                </div>
                <p className="text-xs text-white/50">Java Edition Format</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gold/10 flex items-center gap-2 text-gold">
              <HardDrives size={20} />
              <p className="text-xs text-white/70">Optimized network & zero delay hardware</p>
            </div>
          </Card>
        </div>

        {/* Content Tabs Section */}
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto bg-black/50 border border-gold/20 rounded-xl p-1 mb-8">
              <TabsTrigger value="overview" className="data-[state=active]:bg-gold data-[state=active]:text-black rounded-lg text-sm font-bold py-2">Overview</TabsTrigger>
              <TabsTrigger value="features" className="data-[state=active]:bg-gold data-[state=active]:text-black rounded-lg text-sm font-bold py-2">Features</TabsTrigger>
              <TabsTrigger value="media" className="data-[state=active]:bg-gold data-[state=active]:text-black rounded-lg text-sm font-bold py-2">Media</TabsTrigger>
            </TabsList>

            {/* TAB 1: NEW TENSURA OVERVIEW TEXT */}
            <TabsContent value="overview">
              <Card className="p-8 bg-black/40 backdrop-blur-sm border-gold/20">
                <h2 className="text-3xl font-extrabold gradient-text-primary mb-6">About the Server</h2>
                <div className="space-y-6 text-white/80 leading-relaxed text-md">
                  <p>
                    Step into a world of magic, machines, and monsters in this expansive adventure mod pack built around the <span className="text-gold font-bold">Tensura Reincarnated</span> mod. Inspired by the world of <span className="text-gold/90 italic">That Time I Got Reincarnated as a Slime</span>, you’ll harness powerful abilities, evolve through unique skills, and carve your path as a ruler, warrior, or mage.
                  </p>
                  <p>
                    Paired with the engineering marvels of <span className="text-gold font-bold">Create</span> and the structured world of <span className="text-gold font-bold">Survive the Bosses of Calamity</span>, you’ll build thriving communities, automate complex systems, and watch your empire grow. Dive deep into a rich variety of trade mods, each offering its own system and progression paths to master.
                  </p>
                  <p>
                    Designed for explorers and builders alike, this pack is loaded with adventure quests and challenges that will guide you through every aspect of gameplay—from survival and combat to colony management and magical domination. Whether you're conquering dungeons, developing advanced tech, or commanding your colony, there's always a new goal to chase.
                  </p>
                </div>
              </Card>
            </TabsContent>

            {/* TAB 2: FEATURES */}
            <TabsContent value="features">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { title: 'Custom 3D Weapons', desc: 'Wield custom sword, armor, and bow models designed to replicate powerful anime treasures.' },
                  { title: 'Dynamic Boss Encounters', desc: 'Assemble teams to defeat massive, custom-coded bosses complete with attack stages.' },
                  { title: 'Multiplayer Dungeons', desc: 'Team up with friends to explore custom puzzle dungeons, raids, and labyrinth layouts.' },
                  { title: 'Spellcasting & Skills', desc: 'Acquire incredible skills and spell trees based on elemental and spatial magics.' },
                  { title: 'Guilds & Factions', desc: 'Create factions with other players, compete in PvP seasons, and secure your guild hall.' },
                  { title: 'Fully Custom Economy', desc: 'Trade, complete quests, manage shops, and purchase ranks via our unified shop!' }
                ].map((feature, i) => (
                  <Card key={i} className="p-6 bg-black/40 border border-gold/20 hover:border-gold/50 transition-all duration-300">
                    <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-sm text-white/70 leading-relaxed">{feature.desc}</p>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* TAB 3: SECURE PERSISTENT MEDIA MANAGER */}
            <TabsContent value="media" className="space-y-6">
              
              {/* Owner Authentication / Control Panel */}
              <Card className="p-5 bg-black/60 border border-gold/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold/10 text-gold flex items-center justify-center border border-gold/20">
                    {isAdminMode ? <ShieldCheck size={20} /> : <Lock size={20} />}
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Server Owner Panel</h4>
                    <p className="text-xs text-white/50">
                      {isAdminMode 
                        ? 'Admin mode active. You can now upload and delete media items!' 
                        : 'Unlock the ability to upload and delete media photos.'}
                    </p>
                  </div>
                </div>

                {/* Authentication Forms */}
                {!isAdminMode ? (
                  !showPasswordPrompt ? (
                    <Button 
                      onClick={() => setShowPasswordInput(true)}
                      className="bg-gold/20 border border-gold/30 hover:bg-gold/30 text-white text-xs font-bold"
                    >
                      Enter Owner Mode
                    </Button>
                  ) : (
                    <form onSubmit={handleVerifyPassword} className="flex gap-2 w-full md:w-auto">
                      <Input
                        type="password"
                        placeholder="Owner Password"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        className="bg-black border border-gold/20 text-white text-xs max-w-[150px]"
                      />
                      <Button type="submit" className="bg-gold text-black text-xs font-bold px-3">
                        Unlock
                      </Button>
                      <Button 
                        type="button" 
                        onClick={() => setShowPasswordInput(false)}
                        className="bg-red-500/20 text-white border border-red-500/30 text-xs px-2"
                      >
                        Cancel
                      </Button>
                    </form>
                  )
                ) : (
                  <Button 
                    onClick={() => setIsAdminMode(false)}
                    className="bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30 text-xs font-bold"
                  >
                    Lock Owner Mode
                  </Button>
                )}
              </Card>

              {/* Upload Panel (Visible only when Admin Mode is unlocked) */}
              {isAdminMode && (
                <Card className="p-6 bg-black/50 border border-gold/30 space-y-4">
                  <h3 className="text-lg font-bold text-gold">Upload New Server Photo</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Method 1: Local File Uploader */}
                    <div className="space-y-2 border border-gold/10 p-4 rounded-lg bg-black/20 flex flex-col justify-between">
                      <div>
                        <span className="text-xs text-gold uppercase tracking-wider font-bold block mb-1">Option 1: Upload from Computer</span>
                        <p className="text-xs text-white/50 mb-3">Upload any image file (.png, .jpg, .webp) directly from your device.</p>
                      </div>
                      <div className="space-y-3">
                        <Input
                          placeholder="Image Caption/Title (e.g. Castle Spawn)"
                          value={newImageTitle}
                          onChange={(e) => setNewImageTitle(e.target.value)}
                          className="bg-black border border-gold/20 text-xs"
                        />
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            id="file-upload"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                          <label 
                            htmlFor="file-upload"
                            className="flex items-center justify-center gap-2 w-full h-10 bg-gold text-black text-xs font-bold rounded-lg cursor-pointer hover:bg-yellow-400 transition-colors"
                          >
                            <Upload size={16} />
                            Choose & Upload File
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Method 2: Image URL Parser */}
                    <form onSubmit={handleAddImageUrl} className="space-y-2 border border-gold/10 p-4 rounded-lg bg-black/20 flex flex-col justify-between">
                      <div>
                        <span className="text-xs text-gold uppercase tracking-wider font-bold block mb-1">Option 2: Add via Image URL</span>
                        <p className="text-xs text-white/50 mb-3">Paste a direct web link to any image hosted online.</p>
                      </div>
                      <div className="space-y-3">
                        <Input
                          placeholder="Image Caption/Title"
                          value={newImageTitle}
                          onChange={(e) => setNewImageTitle(e.target.value)}
                          className="bg-black border border-gold/20 text-xs"
                        />
                        <div className="flex gap-2">
                          <Input
                            placeholder="https://example.com/image.jpg"
                            value={newImageUrl}
                            onChange={(e) => setNewImageUrl(e.target.value)}
                            className="bg-black border border-gold/20 text-xs flex-1"
                          />
                          <Button type="submit" className="bg-gold text-black text-xs font-bold">
                            Add Link
                          </Button>
                        </div>
                      </div>
                    </form>
                  </div>
                </Card>
              )}

              {/* Image Gallery Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {(mediaItems || []).map((media) => (
                  <div key={media.id} className="relative aspect-square rounded-xl overflow-hidden border border-gold/20 group shadow-lg">
                    
                    {/* Shadow overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300 z-10" />
                    
                    {/* Image rendering */}
                    <img 
                      src={media.src} 
                      alt={media.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Image Details */}
                    <div className="absolute bottom-4 left-4 z-20 pr-10">
                      <span className="text-[10px] text-gold uppercase tracking-wider font-bold">Screenshot</span>
                      <h4 className="text-sm font-bold text-white mt-0.5 line-clamp-1">{media.title}</h4>
                    </div>

                    {/* Trash Can Delete Button (Only visible in Owner Admin Mode) */}
                    {isAdminMode && (
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDeleteImage(media.id)}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-600 hover:bg-red-500 text-white z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md"
                      >
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
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">
            Ready to Begin Your Adventure?
          </h2>
          <p className="text-md text-white/70 max-w-lg mx-auto leading-relaxed">
            Join thousands of adventurers in the ever-expanding world of Otherworlds. Complete quests, dominate factions, and forge your legend.
          </p>
          <div className="pt-2">
            <a href={DISCORD_INVITE} target="_blank" rel="noopener noreferrer">
              <Button className="h-12 px-8 bg-gradient-to-r from-gold to-yellow-400 hover:from-yellow-400 hover:to-gold text-black font-bold">
                Join Us Today
              </Button>
            </a>
          </div>
        </div>

      </div>
    </div>
  )
}
