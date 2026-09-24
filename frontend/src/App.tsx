import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { Agentation } from 'agentation'
import { UserProvider } from './context/UserContext'
import { ClothingProvider } from './context/ClothingContext'
import { OutfitsProvider } from './context/OutfitsContext'
import { Layout } from './components/Layout'
import { Landing } from './pages/Landing'
import { Login } from './pages/Login'
import { Signup } from './pages/Signup'
import { Dashboard } from './pages/Dashboard'
import { Wardrobe } from './pages/Wardrobe'
import { WardrobeItemNew } from './pages/WardrobeItemNew'
import { WardrobeItemDetail } from './pages/WardrobeItemDetail'
import { Outfits } from './pages/Outfits'
import { OutfitBuilder } from './pages/OutfitBuilder'
import { OutfitDetail } from './pages/OutfitDetail'
import { Account } from './pages/Account'
import { Privacy } from './pages/Privacy'
import { Terms } from './pages/Terms'
import { NotFound } from './pages/NotFound'

export default function App() {
  return (
    <HelmetProvider>
      <UserProvider>
        <ClothingProvider>
          <OutfitsProvider>
            <BrowserRouter>
              <Routes>
                <Route element={<Layout />}>
                  <Route index element={<Landing />} />
                  <Route path="login" element={<Login />} />
                  <Route path="signup" element={<Signup />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="wardrobe" element={<Wardrobe />} />
                  <Route path="wardrobe/new" element={<WardrobeItemNew />} />
                  <Route path="wardrobe/:id" element={<WardrobeItemDetail />} />
                  <Route path="outfits" element={<Outfits />} />
                  <Route path="outfits/new" element={<OutfitBuilder />} />
                  <Route path="outfits/:id" element={<OutfitDetail />} />
                  <Route path="account" element={<Account />} />
                  <Route path="privacy" element={<Privacy />} />
                  <Route path="terms" element={<Terms />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </OutfitsProvider>
        </ClothingProvider>
      </UserProvider>
      {import.meta.env.DEV && <Agentation />}
    </HelmetProvider>
  )
}
