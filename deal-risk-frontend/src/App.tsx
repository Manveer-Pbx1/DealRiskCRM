import { AppLayout } from "./layouts/AppLayout"
import Dashboard from "./pages/dashboard/Dashboard"
import HeroSectionOne from "./pages/hero/Hero"
import { Routes, Route } from "react-router-dom"
export default function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<HeroSectionOne />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </AppLayout>
  )
}
