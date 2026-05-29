import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GameController, DownloadSimple, Star, Users, HardDrives, WifiHigh, Trash, Upload, Lock, ShieldCheck, LinkSimple } from '@phosphor-icons/react'

const DISCORD = (import.meta as any).env?.VITE_DISCORD_INVITE || 'https://discord.gg/'
const PASS = 'admin', URL = 'https://skilllock.notion.site/?v=47f17ccfecf14b8d8ab4e8beb19a700f&pvs=74'
interface Media { id: string; src: string; title: string }

export function GamePage() {
  const [players, setPlayers] = useState<number | string>('Loading...'), [ver, setVer] = useState('Loading...'), [on, setOn] = useState<boolean | null>(null)
  const [avg, setAvg] = useState(4.8), [votes, setVotes] = useState(142), [rating, setRating] = useState<number | null>(null), [hov, setHov] = useState<number | null>(null)
  const [media, setMedia] = useKV<Media[]>('game-media-items', [
    { id: '1', src: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=400', title: 'Cosmic Hub' },
    { id: '2', src: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=400', title: 'Boss Arena' }
  ])
  const [adm, setAdm] = useState(false), [pass, setPass] = useState(''), [showP, setShowP] = useState(false), [title, setTitle] = useState(''), [link, setLink] = useState('')

  useEffect(() => {
    fetch('https://api.mcstatus.io/v2/status/java/otherworldsawakening.theanimevault.net').then(r => r.json()).then(d => {
      if (d.online) { setPlayers(d.players.online); setVer(d.version?.name_clean || '1.20.4'); setOn(true) }
      else { setPlayers('Offline'); setVer('1.20.x'); setOn(false) }
    }).catch(() => { setPlayers('Offline'); setOn(false) })
  }, [])

  const rate = (s: number) => { if (rating !== null) return; setRating(s); const c = votes + 1; setAvg(Number(((avg * votes) + s) / c).toFixed(1)); setVotes(c) }
  const auth = (e: React.FormEvent) => { e.preventDefault(); if (pass === PASS) { setAdm(true); setShowP(false); setPass('') } else alert('Wrong!') }
  const fileUp = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return; const r = new FileReader()
    r.onloadend = () => { setMedia((p: Media[] = []) => [...p, { id: Date.now().toString(), src: r.result as string, title: title || f.name.split('.')[0] }]); setTitle('') }
    r.readAsDataURL(f)
  }

  return (
    <div className="min-h-screen py-12 bg-black/20 backdrop-blur-sm text-white">
      <div className="container mx-auto px-6 max-w-6xl space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-bold uppercase">
              <span className={`w-2 h-2 rounded-full ${on ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>Server {on ? 'Online' : 'Offline'}
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold"><span className="gradient-text-animated block">Otherworlds</span><span className="text-3xl md:text-4xl mt-2 block">Awakening</span></h1>
            <p className="text-lg text-white/80 leading-relaxed">Dive into the ultimate anime-inspired Minecraft MMORPG experience. Command legendary power, embark on dimensional quests, customize custom weapons, and fight side-by-side with an active, welcoming community.</p>
            <div className="flex flex-wrap gap-4"><a href={DISCORD} target="_blank" rel="noreferrer"><Button className="h-12 px-8 bg-gradient-to-r from-gold to-yellow-400 text-black font-bold"><GameController size={20} className="mr-2" /> Join Discord</Button></a>
              <Button variant="outline" onClick={() => { navigator.clipboard.writeText('otherworldsawakening.theanimevault.net'); alert('Server IP copied!') }} className="h-12 px-8 border-gold/30 text-white hover:bg-gold/10 font-bold"><DownloadSimple size={20} className="mr-2" /> Copy Server IP</Button>
            </div>
          </div>
          <a href={URL} target="_blank" rel="noreferrer" className="block relative aspect-video rounded-2xl overflow-hidden border border-gold/30 shadow-2xl group cursor-pointer">
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-2 group-hover:bg-black/20 transition-all duration-300 z-10">
              <div className="w-16 h-16 rounded-full bg-gold/90 text-black flex items-center justify-center shadow-lg group-hover:scale-110 transition-all"><LinkSimple size={24} weight="bold" /></div>
              <span className="text-white text-xs font-bold uppercase tracking-widest mt-1 bg-black/60 border border-gold/20 px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">Visit Notion Guide</span>
            </div>
            {/* CORRECTED COVER IMAGE PATH */}
            <img src="/gamers-cover.png" alt="Notion" className="w-full h-full object-cover" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-black/40 border-gold/20 flex flex-col justify-between hover:border-gold/40 transition-all">
            <div><h3 className="text-white/60 text-sm font-semibold uppercase mb-2">Player Rating</h3><div className="flex items-baseline gap-2"><span className="text-4xl font-extrabold">{avg}</span><span className="text-lg text-white/55">/ 5</span></div></div>
            <div className="mt-4 pt-4 border-t border-gold/10"><div className="flex items-center gap-1">{[1, 2, 3, 4, 5].map(s => (<button key={s} disabled={rating !== null} onMouseEnter={() => setHov(s)} onMouseLeave={() => setHov(null)} onClick={() => rate(s)}><Star size={24} weight={(hov !== null ? s <= hov : s <= (rating ?? Math.round(avg))) ? 'fill' : 'regular'} className={(hov !== null ? s <= hov : s <= (rating ?? Math.round(avg))) ? 'text-gold' : 'text-white/30'} /></button>))}</div><p className="text-xs text-white/50 mt-2">{rating !== null ? `Thanks! (${votes} votes)` : `Click stars to rate (${votes} votes)`}</p></div>
          </Card>
          <Card className="p-6 bg-black/40 border-gold/20 flex flex-col justify-between hover:border-gold/40 transition-all">
            <div><h3 className="text-white/60 text-sm font-semibold uppercase mb-2">Active Players</h3><div className="flex items-center gap-3"><span className="text-4xl font-extrabold">{players}</span>{on && <span className="flex h-3 w-3 rounded-full bg-green-500 animate-ping"></span>}</div></div>
            <div className="mt-4 pt-4 border-t border-gold/10 flex items-center gap-2 text-gold"><Users size={20} /><p className="text-xs text-white/70">otherworldsawakening.theanimevault.net</p></div>
          </Card>
          <Card className="p-6 bg-black/40 border-gold/20 flex flex-col justify-between hover:border-gold/40 transition-all">
            <div><h3 className="text-white/60 text-sm font-semibold uppercase mb-2">Server Details</h3><div className="text-2xl font-bold flex items-center gap-2"><WifiHigh size={24} className="text-gold" /><span>{ver}</span></div></div>
            <div className="mt-4 pt-4 border-t border-gold/10 flex items-center gap-2 text-gold"><HardDrives size={20} /><p className="text-xs text-white/70">Optimized hardware</p></div>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto bg-black/50 border border-gold/20 rounded-xl p-1 mb-8">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gold data-[state=active]:text-black rounded-lg text-sm font-bold py-2">Overview</TabsTrigger>
            <TabsTrigger value="features" className="data-[state=active]:bg-gold data-[state=active]:text-black rounded-lg text-sm font-bold py-2">Features</TabsTrigger>
            <TabsTrigger value="media" className="data-[state=active]:bg-gold data-[state=active]:text-black rounded-lg text-sm font-bold py-2">Media</TabsTrigger>
          </TabsList>
          <TabsContent value="overview"><Card className="p-8 bg-black/40 border-gold/20 space-y-6 text-white/80 leading-relaxed"><h2 className="text-3xl font-extrabold text-gold">About the Server</h2><p>Step into a world of magic, machines, and monsters in this expansive adventure mod pack built around the <span className="text-gold font-bold">Tensura Reincarnated</span> mod. Inspired by the world of <span className="text-gold italic">That Time I Got Reincarnated as a Slime</span>, you’ll harness powerful abilities, evolve through unique skills, and carve your path as a ruler, warrior, or mage.</p><p>Paired with the engineering marvels of <span className="text-gold font-bold">Create</span> and the structured world, <span className="text-gold font-bold">Survive the Bosses of Calamity</span>, you’ll build thriving communities, automate complex systems, and watch your empire grow. Dive deep into a rich variety of trade mods, each offering its own system and progression paths to master.</p><p>Designed for explorers and builders alike, this pack is loaded with adventure quests and challenges that will guide you through every aspect of gameplay—from survival and combat to colony management and magical domination.</p></Card></TabsContent>
          <TabsContent value="features"><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { t: 'Custom Cosmetics', d: "Deck out your character with custom armor, weapons, tools & more — because standing out is the whole point." },
              { t: 'Dynamic Boss Encounters', d: "Face legendary bosses from Bosses Rise & Tensura — epic, brutal, and nothing like anything you've fought before." },
              { t: 'Choose your battle', d: "Your world, your rules — toggle PvP or PvE instantly with a quick command. Fight others or go solo, the choice is yours." },
              { t: 'Spellcasting & Skills', d: "Master powerful spells with Iron's Spells & Spellbooks — then unlock your true potential through a custom skill system tied to your race and evolution. Your power is earned, not given." },
              { t: 'Guilds and Homes', d: "Build your legacy — form powerful guilds, rise through the ranks, and claim your own rentable home. Every empire starts somewhere." },
              { t: 'Fully Custom Economy', d: 'Trade, complete quests, manage shops, and purchase ranks via our unified shop!' }
            ].map((f, i) => (<Card key={i} className="p-6 bg-black/40 border border-gold/20 hover:border-gold/50 transition-all"><h3 className="text-lg font-bold mb-2">{f.t}</h3><p className="text-sm text-white/70 leading-relaxed">{f.d}</p></Card>))}
          </div></TabsContent>
          <TabsContent value="media" className="space-y-6">
            <Card className="p-5 bg-black/60 border border-gold/20 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-gold/10 text-gold flex items-center justify-center border border-gold/20">{adm ? <ShieldCheck size={20} /> : <Lock size={20} />}</div><div><h4 className="font-bold">Server Owner Panel</h4><p className="text-xs text-white/50">{adm ? 'Admin mode active. Upload and delete media items!' : 'Unlock image uploader and delete controls.'}</p></div></div>
              {!adm ? (!showP ? (<Button onClick={() => setShowP(true)} className="bg-gold/20 border border-gold/30 text-white text-xs">Enter Owner Mode</Button>) : (
                <form onSubmit={auth} className="flex gap-2"><Input type="password" placeholder="Password" value={pass} onChange={e => setPass(e.target.value)} className="bg-black border border-gold/20 text-xs max-w-[120px]" /><Button type="submit" className="bg-gold text-black text-xs font-bold px-3">Unlock</Button><Button type="button" onClick={() => setShowP(false)} className="bg-red-500/20 text-white text-xs px-2">Cancel</Button></form>)) : (<Button onClick={() => setAdm(false)} className="bg-red-500/20 text-red-300 border border-red-500/30 text-xs">Lock Owner Mode</Button>)}
            </Card>
            {adm && (<Card className="p-6 bg-black/50 border border-gold/30 space-y-4"><h3 className="text-lg font-bold text-gold">Upload New Server Photo</h3><div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 border border-gold/10 p-4 rounded-lg bg-black/20 flex flex-col justify-between"><div><span className="text-xs text-gold uppercase font-bold block mb-1">Upload from Device</span><p className="text-xs text-white/50 mb-3">Add image files from your computer.</p></div><div className="space-y-3"><Input placeholder="Image Caption" value={title} onChange={e => setTitle(e.target.value)} className="bg-black border border-gold/20 text-xs" /><div className="relative"><input type="file" accept="image/*" id="file-upload" onChange={fileUp} className="hidden" /><label htmlFor="file-upload" className="flex items-center justify-center gap-2 w-full h-10 bg-gold text-black text-xs font-bold rounded-lg cursor-pointer"><Upload size={16} /> Choose File</label></div></div></div>
              <form onSubmit={e => { e.preventDefault(); if (link) setMedia((p: Media[] = []) => [...p, { id: Date.now().toString(), src: link, title: title || 'Custom Link' }]); setTitle(''); setLink('') }} className="space-y-2 border border-gold/10 p-4 rounded-lg bg-black/20 flex flex-col justify-between"><div><span className="text-xs text-gold uppercase font-bold block mb-1">Add via Image Link</span><p className="text-xs text-white/50 mb-3">Paste a direct web link to an online image.</p></div><div className="space-y-3"><Input placeholder="Image Caption" value={title} onChange={e => setTitle(e.target.value)} className="bg-black border border-gold/20 text-xs" /><div className="flex gap-2"><Input placeholder="https://example.com/image.jpg" value={link} onChange={e => setLink(e.target.value)} className="bg-black border border-gold/20 text-xs flex-1" /><Button type="submit" className="bg-gold text-black text-xs font-bold">Add</Button></div></div></form>
            </div></Card>)}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">{(media || []).map(m => (
              <div key={m.id} className="relative aspect-square rounded-xl overflow-hidden border border-gold/20 group shadow-lg"><div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent opacity-60 z-10" /><img src={m.src} alt={m.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /><div className="absolute bottom-4 left-4 z-20"><span className="text-[10px] text-gold uppercase font-bold">Screenshot</span><h4 className="text-sm font-bold text-white mt-0.5 line-clamp-1">{m.title}</h4></div>
                {adm && (<Button variant="destructive" size="icon" onClick={() => { if (confirm('Delete?')) setMedia((p: Media[] = []) => p.filter(i => i.id !== m.id)) }} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-600 hover:bg-red-500 text-white z-30 opacity-0 group-hover:opacity-100 transition-opacity"><Trash size={16} /></Button>)}
              </div>))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
