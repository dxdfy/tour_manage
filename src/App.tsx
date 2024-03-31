import React from 'react'
import './App.css'
import MyLayout from './components/MyLayout'
import {Route,Routes} from 'react-router-dom'
import CaseManage from './pages/casemanage'
function App() {
  return (
    <MyLayout>
      <Routes>
        <Route path='case' element={<CaseManage />} />
        {/* <Route path='case/caseshow' element={<Show />}/> */}
      </Routes>
    </MyLayout>
      
  )
}
export default App
