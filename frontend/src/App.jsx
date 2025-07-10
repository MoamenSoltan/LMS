import './index.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import TeacherSignup from '../pages/TeacherSignup'
function App() {


  return (
    <div>
      <BrowserRouter>


      <Routes>


        <Route path='/' element={<Login />} />
        <Route path='/login' element={<Login />} />

        
        <Route path='/signup' element={<Signup />} />
        <Route path='/teacherSignup' element={<TeacherSignup />} />



      </Routes>



      </BrowserRouter>
    </div>
  )
}

export default App
