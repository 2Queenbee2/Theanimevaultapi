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
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity
