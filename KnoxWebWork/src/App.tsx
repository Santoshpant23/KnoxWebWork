import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Footer from './components/Footer'
import HomePage from './components/HomePage'
import NavBar from './components/NavBar'
import Signup from './components/Signup'
import Login from './components/Login'

function App() {


  return (
    <BrowserRouter>
      <NavBar/>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={<Signup />}/>
      <Route path="/login" element={<Login />}/>
        {/* <Route index element={<RecentActivity />} /> */}
        {/* <Route path="project/:id" element={<Project />} /> */}
      {/* </Route> */}
    </Routes>
      <Footer/>
  </BrowserRouter>
  )
}

export default App
