import React, { useEffect, useRef, useState } from 'react';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, LockOutlined, UserOutlined, WarningOutlined } from '@ant-design/icons';
import type { GetRef, TableColumnsType, TableColumnType } from 'antd';
import { Button, Card, Input, Space, Table, Form, Modal, Radio, message } from 'antd';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import axios from 'axios';

type InputRef = GetRef<typeof Input>;

interface DataType {
  key: number;
  name: string;
  role: string;
  pwd: string;
}

type DataIndex = keyof DataType;

const UserManage: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);
  const [datasource, setDatasource] = useState<DataType[]>([]);
  const [isModal1Open, setIsModal1Open] = useState(false);
  const [isModal2Open, setIsModal2Open] = useState(false);
  const [isModal3Open, setIsModal3Open] = useState(false);
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const [form3] = Form.useForm();
  const [radioValue1, setRadioValue1] = useState('审核人员');
  const [radioValue2, setRadioValue2] = useState('审核人员');
  const [query, setQuery] = useState({});
  const [rec, setRec] = useState({
    key: 1,
    name: 'John Brown',
    role: '审核人员',
    pwd: '123456'
  })
  useEffect(() => {
    const storedToken = sessionStorage.getItem('token');
    console.log(storedToken);
    axios.defaults.headers.common['Authorization'] = storedToken;
    axios.get('http://127.0.0.1:3007/back/auditors')
      .then(response => {
        console.log(response.data);
        // 根据 query.name 进行筛选
        const MyData: DataType[] = response.data.data.map(item => ({
          key: item.id,
          name: item.username,
          role: '审核人员',
          pwd: item.password
        }));
        setDatasource(MyData);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, [query])
  const RadioChange1 = (e) => {
    setRadioValue1(e.target.value)
    form1.setFieldsValue({ "role": e.target.value });
  };
  const RadioChange2 = (e) => {
    setRadioValue2(e.target.value)
    form2.setFieldsValue({ "role": e.target.value });
  };


  //关闭弹窗
  const close = () => {
    setIsModal1Open(false);
    setIsModal2Open(false);
    setIsModal3Open(false)
  };


  const AddFormFinish = async (value) => {
    if (confirm("确定要添加这个用户吗") === true) {

      const postData = {
        username: value.name,
        password: value.pwd,
        role: value.role === '审核人员' ? 'audit' : 'manage'
      };
      console.log('add', postData);
      const config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      };
      await axios.post('http://127.0.0.1:3007/back/register', new URLSearchParams(postData), config)
        .then(response => {
          console.log(response.data);
          if (response.data.message === '注册成功') {
            message.success('添加用户成功')
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
      setQuery({})
      setIsModal1Open(false)
      form1.resetFields()
    }

  }
  const ModifyFormFinish = async (value) => {
    if (confirm("确定要将这个用户的信息修改成如下信息吗") === true) {
      axios.defaults.headers.common['Authorization'] = sessionStorage.getItem('token');
      const postData = {
        id: value.key,
        username: value.name,
        permission: value.role
      }
      const config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      };
      await axios.post('http://127.0.0.1:3007/back/update', new URLSearchParams(postData), config)
        .then(response => {
          console.log(response.data);
          if (response.data.message === '用户更新成功') {
            message.success('用户更新成功');
            setQuery({});
          } else if (response.data.message === '该用户名已存在') {
            message.error('该用户名已经存在');
          } else if (response.data.message === '用户不存在或无权限修改') {
            message.error('用户不存在或无权限修改');
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
      setIsModal2Open(false);
    }
  }

  const PwdFormFinish = async (value) => {
    console.log(rec);
    if (confirm("确定要修改密码吗") === true) {
      axios.defaults.headers.common['Authorization'] = sessionStorage.getItem('token');
      const postData = {
        id: rec.key,
        password: value.pwd,
      }
      const config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      };
      await axios.post('http://127.0.0.1:3007/back/pwd', new URLSearchParams(postData), config)
        .then(response => {
          console.log(response.data);
          if (response.data.message === '密码更新成功') {
            message.success('用户密码更新成功');
            setQuery({});
            setIsModal3Open(false);
            form3.resetFields()
          } else {
            message.error('密码不符合格式要求');
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  }

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps['confirm'],
    dataIndex: DataIndex,
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex: DataIndex): TableColumnType<DataType> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            搜索
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            重置
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const columns: TableColumnsType<DataType> = [
    {
      title: '用户ID',
      dataIndex: 'key',
      key: 'key',
      width: '20%',
      ...getColumnSearchProps('key'),
      sorter: (a, b) => a.key - b.key,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: '用户名',
      dataIndex: 'name',
      key: 'name',
      width: '25%',
      ...getColumnSearchProps('name'),
    },
    {
      title: '角色权限',
      dataIndex: 'role',
      key: 'role',
      width: '25%',
      ...getColumnSearchProps('role'),
    },
    {
      title: '操作',
      key: 'action',
      width: '30%',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" icon={<EditOutlined />} onClick={() => {
            setIsModal2Open(true);
            form2.setFieldsValue({
              'key': record.key,
              'name': record.name,
              'role': record.role,
            });
            setRec(record);
          }}>编辑用户</Button>
          <Button type="primary" style={{ backgroundColor: 'black' }} icon={<WarningOutlined />} onClick={() => {
            setIsModal3Open(true);
            setRec(record);
          }}>修改密码</Button>
          <Button type="primary" style={{ backgroundColor: 'red' }} onClick={async () => {
            if (confirm("确定要删除这条用户数据吗")) {
              console.log("删除", record);
              console.log(rec);

              axios.defaults.headers.common['Authorization'] = sessionStorage.getItem('token');
              const postData = {
                id: rec.key,
              }
              const config = {
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
                }
              };
              await axios.post('http://127.0.0.1:3007/back/deleteById', new URLSearchParams(postData), config)
                .then(response => {
                  console.log(response.data);
                  if (response.data.message === '用户删除成功') {
                    message.success('用户删除成功');
                    setQuery({});
                  } else {
                    message.error('用户删除失败');
                  }
                })
                .catch(error => {
                  console.error('Error:', error);
                });

            }
          }} icon={<DeleteOutlined />}>删除用户</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Modal title="添加用户" open={isModal1Open} onCancel={close} footer={[]}>
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
            'key': datasource.length + 1,
            'role': '审核人员'
          }}
        >
          <Form.Item
            name="key"
            style={{ display: 'none' }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="name"
            rules={[{ required: true, message: '请输入账号' }]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="账号" />
          </Form.Item>
          <Form.Item
            name="pwd"
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
            }}>提交</Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal title="编辑用户" open={isModal2Open} onCancel={close} footer={[]}>
        <Form
          style={{ marginTop: '30px' }}
          labelCol={{
            md: {
              span: 4,
            },
          }}
          form={form2}
          onFinish={ModifyFormFinish}
        >
          <Form.Item
            name="key"
            style={{ display: 'none' }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="name"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户名" />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }} name="role">
            <Radio.Group onChange={RadioChange2} value={radioValue2}>
              <Radio.Button value="审核人员">审核人员</Radio.Button>
              <Radio.Button value="管理员">管理员</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item>
            <Button htmlType='submit' type='primary' style={{
              display: 'block',
              margin: '8px auto',
              width: '20vw',
            }}>提交</Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal title="修改密码" open={isModal3Open} onCancel={close} footer={[]}>
        <Form
          style={{ marginTop: '30px' }}
          labelCol={{
            md: {
              span: 4,
            },
          }}
          onFinish={PwdFormFinish}
          form={form3}
        >
          <Form.Item
            name="key"
            style={{ display: 'none' }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="pwd"
            rules={[{ required: true, message: '请输入新密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="新密码"
            />
          </Form.Item>
          <Form.Item>
            <Button htmlType='submit' type='primary' style={{
              display: 'block',
              margin: '8px auto',
              width: '20vw',
            }}>提交</Button>
          </Form.Item>
        </Form>
      </Modal>
      <Card
        title='用户管理'
        extra={
          <>
            <Button type="primary" style={{ float: 'right' }} icon={<PlusOutlined />} onClick={() => {
              setIsModal1Open(true);
            }}>添加用户</Button>
          </>
        }
      >
        <Table columns={columns} dataSource={datasource} pagination={{ defaultPageSize: 8 }} />
      </Card>
    </div >
  );
};

export default UserManage;