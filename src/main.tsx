import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import zhCN from 'antd/lib/locale/zh_CN'
import {ConfigProvider} from 'antd'
import {HashRouter as Router,Route,Routes,Navigate} from'react-router-dom'
import Login from './pages/login.tsx'
const PrivateRoute = ({ element, ...rest }) => {
  // 检查sessionStorage中是否存在token
  const token = sessionStorage.getItem('token');
  
  // 如果token不存在，则重定向到登录页面
  if (!token) {
    console.log('你还未登录');
    return <Navigate to="/" />;
  }

  // 如果token存在，则渲染传入的元素
  return React.cloneElement(element, rest);
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Router>
    <ConfigProvider locale={zhCN}>
      <Routes>
        <Route path='/' element={<Login />} />
        {/* <Route path='/index/*' element={<App />} /> */}
        <Route path="/index/*" element={<PrivateRoute element={<App />} />} />
      </Routes>
    </ConfigProvider>
  </Router>
  
)