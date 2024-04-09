import { Row, Col, Card, Form, Button, message, Input, Radio, Modal } from 'antd'
import React, { useState } from 'react';
import type { RadioChangeEvent } from 'antd';
import logo from '../assets/1.ico'
import { Navigate, useNavigate } from 'react-router-dom'
import { UserOutlined, LockOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';
import axios from 'axios';

function Login() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const [radioValue1, setRadioValue1] = useState('审核人员');
  const [isModal1Open, setIsModal1Open] = useState(false);

  const AddFormFinish = async (value) => {
    console.log('注册', value)
    const postData = { ...value };
    // 检查 role 的值并相应地修改 postData 的 role
    if (value.role === '审核人员') {
      postData.role = 'audit';
    } else if (value.role === '管理员') {
      postData.role = 'manage';
    }
    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };
    await axios.post('http://127.0.0.1:3007/back/register', new URLSearchParams(postData), config)
      .then(response => {
        console.log(response.data);
        if (response.data.message === '注册成功') {
          message.success('注册成功');
          close();
        }
        if (response.data.status === 1){
          if (response.data.message === '用户名重复') {
            message.error('用户名重复');
          }else{
            message.error('用户名或密码不符合格式');
          }
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
  const close = () => {
    setIsModal1Open(false);
  };


  const RadioChange1 = (e) => {
    setRadioValue1(e.target.value)
    form1.setFieldsValue({ "role": e.target.value });
  };
  return (
    <Row>
      <Col
        md={{
          span: 8,
          push: 8,
        }}
        xs={{
          span: 22,
          push: 8,
        }}
      >
        <img src={logo} style={{
          display: 'block',
          margin: '20px auto',
          borderRadius: '16px',
          width: '200px',
        }} />
        <Modal title="注册用户" open={isModal1Open} onCancel={close} footer={[]}>
          <Form
            style={{ marginTop: '30px' }}
            labelCol={{
              md: {
                span: 4,
              },
            }}
            form={form1}
            onFinish={AddFormFinish}
            initialValues={{
              'role': '审核人员'
            }}
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: '请输入账号' }]}
            >
              <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="账号" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="密码"
              />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }} name="role">
              <Radio.Group defaultValue="审核人员" onChange={RadioChange1} value={radioValue1}>
                <Radio.Button value="审核人员">审核人员</Radio.Button>
                <Radio.Button value="管理员">管理员</Radio.Button>
              </Radio.Group>
            </Form.Item>
            <Form.Item>
              <Button htmlType='submit' type='primary' style={{
                display: 'block',
                margin: '8px auto',
                width: '20vw',
              }}>注册</Button>
            </Form.Item>
          </Form>
        </Modal>
        <Card title='游记审核系统'>
          <Form
            labelCol={{
              md: {
                span: 4,
              },
            }}
            initialValues={{

            }}
            onFinish={(value) => {
              console.log('我的', value)
              const postData = value;
              const config = {
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
                }
              };
              axios.post('http://127.0.0.1:3007/back/login', new URLSearchParams(postData), config)
                .then(response => {
                  console.log(response.data);
                  if (response.data.message === '登录成功') {
                    sessionStorage.setItem('token', response.data.token)
                    sessionStorage.setItem('permission', response.data.permission)
                    navigate('/index')
                  }
                })
                .catch(error => {
                  console.error('Error:', error);
                });


            }}
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户名" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="密码"
              />
            </Form.Item>
            <Button htmlType='submit' type='primary' style={{
              display: 'block',
              margin: '8px auto',
              width: '20vw',
            }}
              onClick={() => {
                setIsModal1Open(true)
              }}>点此注册</Button>
            <Form.Item>
              <Button htmlType='submit' type='primary' style={{
                display: 'block',
                margin: '8px auto',
                width: '20vw',
              }}>登录</Button>
            </Form.Item>
          </Form>
        </Card>

      </Col>
    </Row>
  )
}
export default Login