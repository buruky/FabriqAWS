import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { Agentation } from 'agentation'
import { UserProvider } from './context/UserContext'
import { Layout } from './components/Layout'
import { Landing } from './pages/Landing'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Dashboard } from './pages/Dashboard'
import { Wardrobe } from './pages/Wardrobe'
import { Outfits } from './pages/Outfits'
import { OutfitCreate } from './pages/OutfitCreate'
import { OutfitDetail } from './pages/OutfitDetail'
import { GeneratedOutfit } from './pages/GeneratedOutfit'
import { Profile } from './pages/Profile'
import { Privacy } from './pages/Privacy'
import { Terms } from './pages/Terms'
import { NotFound } from './pages/NotFound'

export default function App() {
  return (
    <HelmetProvider>
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Landing />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="wardrobe" element={<Wardrobe />} />
              <Route path="outfits" element={<Outfits />} />
              <Route path="outfits/create" element={<OutfitCreate />} />
              <Route path="outfits/:id" element={<OutfitDetail />} />
              <Route path="generated-outfit" element={<GeneratedOutfit />} />
              <Route path="profile" element={<Profile />} />
              <Route path="privacy" element={<Privacy />} />
              <Route path="terms" element={<Terms />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </UserProvider>
      {import.meta.env.DEV && <Agentation />}
    </HelmetProvider>
  )
}
