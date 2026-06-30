import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { User, Package, Heart, Gear, Star, SignOut, Eye, EyeSlash } from '@phosphor-icons/react'
import { supabase, Profile, Favourite, Order } from '@/lib/supabase'
import { toast } from 'sonner'

export function AccountPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [favourites, setFavourites] = useState<Favourite[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')
  const [showPassword, setShowPassword] = useState(false)

  // Auth form state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [authLoading, setAuthLoading] = useState(false)

  // Profile edit state
  const [editUsername, setEditUsername] = useState('')
  const [editFirstName, setEditFirstName] = useState('')
  const [editLastName, setEditLastName] = useState('')

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        loadProfile(session.user.id)
        loadFavourites(session.user.id)
        loadOrders(session.user.id)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        loadProfile(session.user.id)
        loadFavourites(session.user.id)
        loadOrders(session.user.id)
      } else {
        setProfile(null)
        setFavourites([])
        setOrders([])
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (data) {
      setProfile(data)
      setEditUsername(data.username || '')
      setEditFirstName(data.first_name || '')
      setEditLastName(data.last_name || '')
    }
  }

  const loadFavourites = async (userId: string) => {
    const { data } = await supabase
      .from('favourites')
      .select('*')
      .eq('user_id', userId)
    setFavourites(data || [])
  }

  const loadOrders = async (userId: string) => {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    setOrders(data || [])
  }

  const handleLogin = async () => {
    setAuthLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Welcome back!')
    }
    setAuthLoading(false)
  }

  const handleSignup = async () => {
    if (!email || !password || !username) {
      toast.error('Please fill in all required fields')
      return
    }
    setAuthLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username, first_name: firstName, last_name: lastName }
      }
    })
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Account created! Please check your email to verify your account.')
    }
    setAuthLoading(false)
  }

  const handleUpdateProfile = async () => {
    if (!user) return
    const { error } = await supabase
      .from('profiles')
      .update({
        username: editUsername,
        first_name: editFirstName,
        last_name: editLastName
      })
      .eq('id', user.id)

    if (error) {
      toast.error('Failed to update profile')
    } else {
      toast.success('Profile updated!')
      loadProfile(user.id)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    toast.success('Signed out!')
  }

  const handleRemoveFavourite = async (productId: string) => {
    if (!user) return
    await supabase
      .from('favourites')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', productId)
    loadFavourites(user.id)
    toast.success('Removed from favourites')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    )
  }

  // NOT LOGGED IN — Show login/signup form
  if (!user) {
    return (
      <div className="min-h-screen py-12 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md mx-auto"
          >
            <h1 className="text-5xl font-bold mb-2">
              My <span className="gradient-text-gold-blue">Account</span>
            </h1>
            <p className="text-white/70 mb-8">Sign in to track orders, earn points, and save favourites</p>

            <Card className="p-8 bg-black/40 backdrop-blur-sm border-gold/20">
              {/* Toggle */}
              <div className="flex rounded-lg overflow-hidden border border-gold/20 mb-6">
                <button
                  onClick={() => setAuthMode('login')}
                  className={`flex-1 py-2 text-sm font-medium transition-all ${
                    authMode === 'login' ? 'bg-gold text-black' : 'text-white/70 hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setAuthMode('signup')}
                  className={`flex-1 py-2 text-sm font-medium transition-all ${
                    authMode === 'signup' ? 'bg-gold text-black' : 'text-white/70 hover:text-white'
                  }`}
                >
                  Create Account
                </button>
              </div>

              <div className="space-y-4">
                {authMode === 'signup' && (
                  <>
                    <div>
                      <label className="block text-sm text-white/70 mb-1">Username *</label>
                      <Input
                        placeholder="coolotaku123"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        className="bg-black/20 border-gold/20"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm text-white/70 mb-1">First Name</label>
                        <Input
                          placeholder="First"
                          value={firstName}
                          onChange={e => setFirstName(e.target.value)}
                          className="bg-black/20 border-gold/20"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-white/70 mb-1">Last Name</label>
                        <Input
                          placeholder="Last"
                          value={lastName}
                          onChange={e => setLastName(e.target.value)}
                          className="bg-black/20 border-gold/20"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm text-white/70 mb-1">Email *</label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="bg-black/20 border-gold/20"
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/70 mb-1">Password *</label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="bg-black/20 border-gold/20 pr-10"
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                    >
                      {showPassword ? <EyeSlash size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <Button
                  onClick={authMode === 'login' ? handleLogin : handleSignup}
                  disabled={authLoading}
                  className="w-full bg-gold hover:bg-gold/90 text-black font-semibold"
                >
                  {authLoading ? 'Please wait...' : authMode === 'login' ? 'Sign In' : 'Create Account'}
                </Button>

                {authMode === 'signup' && (
                  <p className="text-xs text-white/50 text-center">
                    By creating an account you agree to our terms. You'll earn points on every purchase!
                  </p>
                )}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }

  // LOGGED IN — Show account dashboard
  return (
    <div className="min-h-screen py-12 bg-black/20 backdrop-blur-sm">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-4xl mx-auto mb-8"
        >
          <h1 className="text-5xl font-bold mb-2">
            My <span className="gradient-text-gold-blue">Account</span>
          </h1>
          <p className="text-white/70">Welcome back, {profile?.username || profile?.email || 'Anime Fan'}!</p>
        </motion.div>

        {/* Points Banner */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="bg-gradient-to-r from-gold/20 to-blue-500/20 border border-gold/30 rounded-2xl p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gold/20 flex items-center justify-center">
                <Star size={28} className="text-gold" weight="fill" />
              </div>
              <div>
                <p className="text-white/70 text-sm">Your Points Balance</p>
                <p className="text-4xl font-bold text-gold">{profile?.points || 0}</p>
                <p className="text-white/50 text-xs">100 points = $1.00 CAD off your next order</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white/70 text-sm">Points Value</p>
              <p className="text-2xl font-bold text-white">${((profile?.points || 0) / 100).toFixed(2)} CAD</p>
              <p className="text-white/50 text-xs">Redeemable at checkout</p>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="profile" className="space-y-8">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-black/40 backdrop-blur-sm">
              <TabsTrigger value="profile" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-gold data-[state=active]:text-white">
                <User size={16} />
                Profile
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-gold data-[state=active]:text-white">
                <Package size={16} />
                Orders
              </TabsTrigger>
              <TabsTrigger value="favourites" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-gold data-[state=active]:text-white">
                <Heart size={16} />
                Favourites
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-gold data-[state=active]:text-white">
                <Gear size={16} />
                Settings
              </TabsTrigger>
            </TabsList>

            {/* PROFILE TAB */}
            <TabsContent value="profile">
              <Card className="p-8 bg-black/40 backdrop-blur-sm border-gold/20">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold to-blue-500 flex items-center justify-center text-2xl font-bold text-white">
                      {profile?.username?.[0]?.toUpperCase() || profile?.email?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">{profile?.username || 'Anime Fan'}</h2>
                      <p className="text-white/50 text-sm">{profile?.email}</p>
                      <p className="text-white/50 text-xs">Member since {new Date(profile?.created_at || '').toLocaleDateString('en-CA', { year: 'numeric', month: 'long' })}</p>
                    </div>
                  </div>
                  <Button
                    onClick={handleSignOut}
                    variant="outline"
                    className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                  >
                    <SignOut size={16} className="mr-2" />
                    Sign Out
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Username</label>
                    <Input
                      value={editUsername}
                      onChange={e => setEditUsername(e.target.value)}
                      placeholder="Your username"
                      className="bg-black/20 border-gold/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Email</label>
                    <Input
                      value={profile?.email || ''}
                      disabled
                      className="bg-black/20 border-gold/20 opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">First Name</label>
                    <Input
                      value={editFirstName}
                      onChange={e => setEditFirstName(e.target.value)}
                      placeholder="First name"
                      className="bg-black/20 border-gold/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Last Name</label>
                    <Input
                      value={editLastName}
                      onChange={e => setEditLastName(e.target.value)}
                      placeholder="Last name"
                      className="bg-black/20 border-gold/20"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleUpdateProfile}
                  className="mt-6 bg-gold hover:bg-gold/90 text-black font-semibold"
                >
                  Update Profile
                </Button>
              </Card>
            </TabsContent>

            {/* ORDERS TAB */}
            <TabsContent value="orders">
              {orders.length === 0 ? (
                <Card className="p-12 bg-black/40 backdrop-blur-sm border-gold/20 text-center">
                  <Package size={48} className="text-white/20 mx-auto mb-4" />
                  <h3 className="text-white font-semibold text-lg mb-2">No orders yet</h3>
                  <p className="text-white/50 text-sm">Your order history will appear here once you make a purchase.</p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {orders.map(order => (
                    <Card key={order.id} className="p-6 bg-black/40 backdrop-blur-sm border-gold/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-white">Order #{order.id.slice(0, 8).toUpperCase()}</h3>
                          <p className="text-sm text-white/50">{new Date(order.created_at).toLocaleDateString('en-CA')}</p>
                          <p className="text-sm text-white/50">{order.items?.length || 0} item(s)</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gold">${order.order_total.toFixed(2)} CAD</p>
                          <span className={`text-xs px-2 py-1 rounded ${
                            order.status === 'delivered' ? 'bg-green-500/20 text-green-400' :
                            order.status === 'shipped' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                          {order.points_earned > 0 && (
                            <p className="text-xs text-gold mt-1">+{order.points_earned} points earned</p>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* FAVOURITES TAB */}
            <TabsContent value="favourites">
              {favourites.length === 0 ? (
                <Card className="p-12 bg-black/40 backdrop-blur-sm border-gold/20 text-center">
                  <Heart size={48} className="text-white/20 mx-auto mb-4" />
                  <h3 className="text-white font-semibold text-lg mb-2">No favourites yet</h3>
                  <p className="text-white/50 text-sm">Click the heart icon on any product to save it here!</p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {favourites.map(fav => (
                    <Card key={fav.id} className="p-4 bg-black/40 backdrop-blur-sm border-gold/20">
                      <div className="aspect-square rounded-lg mb-3 overflow-hidden bg-black/20">
                        {fav.product_image ? (
                          <img src={fav.product_image} alt={fav.product_name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Heart size={32} className="text-gold" />
                          </div>
                        )}
                      </div>
                      <h3 className="font-semibold text-white text-sm mb-1 line-clamp-2">{fav.product_name}</h3>
                      <p className="text-gold font-bold mb-3">${fav.product_price.toFixed(2)} CAD</p>
                      <button
                        onClick={() => handleRemoveFavourite(fav.product_id)}
                        className="w-full text-xs text-red-400 hover:text-red-300 transition-colors"
                      >
                        Remove from favourites
                      </button>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* SETTINGS TAB */}
            <TabsContent value="settings">
              <Card className="p-8 bg-black/40 backdrop-blur-sm border-gold/20">
                <h2 className="text-2xl font-bold text-white mb-6">Account Settings</h2>

                <div className="space-y-4 mb-8">
                  <div className="p-4 border border-gold/20 rounded-lg">
                    <h3 className="font-semibold text-white mb-1">Email Address</h3>
                    <p className="text-white/50 text-sm">{profile?.email}</p>
                  </div>
                  <div className="p-4 border border-gold/20 rounded-lg">
                    <h3 className="font-semibold text-white mb-1">Points Balance</h3>
                    <p className="text-gold font-bold">{profile?.points || 0} points</p>
                    <p className="text-white/50 text-xs mt-1">Earn 1 point for every $1 spent</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-gold/20 flex gap-4">
                  <Button
                    onClick={handleSignOut}
                    variant="outline"
                    className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                  >
                    <SignOut size={16} className="mr-2" />
                    Sign Out
                  </Button>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
