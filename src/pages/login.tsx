import{Row,Col,Card,Form, Button, message,Input} from 'antd'
import logo from '../assets/1.ico'
import { Navigate, useNavigate } from 'react-router-dom'
import { loginAPI } from '../services/auth';
import axios from 'axios';
function Login(){
    const navigate= useNavigate();
    return(
        <Row>
          <Col
            md={{
            span:8,
            push:8,
           }}
           xs={{
            span:22,
            push:8,
           }}
          >
            <img src={logo} style={{
                display:'block',
                margin:'20px auto',
                borderRadius:'16px',
                width:'200px',
            }}/>
            <Card title='任务管理系统'>
                <Form
                  labelCol={{
                    md:{
                        span: 4,
                    },
                  }}
                  onFinish={async (v)=>{
                    console.log(v);
                    const postData = v;
                    const config = {
                        headers: {
                          'Content-Type': 'application/x-www-form-urlencoded'
                        }
                      };
                      axios.post('http://127.0.0.1:3007/api/login', new URLSearchParams(postData), config)
                      .then(response => {
                        console.log(response.data);
                        if(response.data.message==='登录成功'){
                            sessionStorage.setItem('token',response.data.token)
                            sessionStorage.setItem('permission',response.data.permission)
                            navigate('/index')
                        }
                      })
                      .catch(error => {
                        console.error('Error:', error);
                      });
                    // const res =await loginAPI(v)
                    // console.log(res);
                    // navigate('/index')
                  }}
                >
                    <Form.Item label='用户名' name='username' rules={[
                        {
                            required:true,
                            message:'请输入用户名'
                        }

                    ]}>
                       <Input placeholder='请输入用户名'></Input>
                    </Form.Item>
                    <Form.Item label='密码' name='password' rules={[
                        {
                            required:true,
                            message:'请输入密码'
                        }

                    ]}>
                       <Input placeholder='请输入密码'></Input>
                    </Form.Item>
                    <Form.Item>
                        <Button htmlType='submit' type='primary' style={{
                            display:'block',
                            margin:'8px auto',
                            width:'20vw',
                        }}>登录</Button>
                    </Form.Item>
                </Form>
            </Card>

          </Col>
        </Row>
    )
}
export default Login