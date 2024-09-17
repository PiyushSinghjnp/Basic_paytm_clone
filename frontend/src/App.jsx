import { useState } from 'react'
import {BrowserRouter,Route,Routes} from 'react-router-dom'
import {Signup} from './pages/Signup';
import {Signin} from './pages/Signin';
import {Dashboard} from './pages/Dashboard';
import {SendMoney} from './pages/SendMoney';
import ProtectedRoute from './component/ProtectedRoute';
import './App.css'

function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProtectedRoute element={<Signup />} />} />
          <Route path="/signin" element={<ProtectedRoute element={<Signin />} />} />
          <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path="/send" element={<SendMoney/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
