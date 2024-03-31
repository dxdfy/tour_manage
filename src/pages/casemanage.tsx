import React, { useEffect, useState } from "react"
import { Popconfirm, Card, Button, Form, Input, Table, Modal, message, Space, Select, Tooltip } from 'antd'
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined, ZoomInOutlined, CheckOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import axios from "axios";
import LazyLoad from 'react-lazyload';
import Show from "./show";
const { Option } = Select;
function CaseManage() {
    const [isShow, setIsShow] = useState(false);//控制modal
    // const [myForm] = Form.useForm();//获取表单元素实例
    const [selectedRowData, setSelectedRowData] = useState(null);
    const [query, setQuery] = useState({});
    const [data, setData] = useState([]);
    const [currentId, setCurrentId] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('全部状态');
    const [isInfoShow, setIsInfoShow] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    
    useEffect(() => {
        const storedToken = sessionStorage.getItem('token');
        console.log(storedToken);
        axios.defaults.headers.common['Authorization'] = storedToken;

        axios.get('http://127.0.0.1:3007/my/task/cates')
            .then(response => {
                console.log(response.data);
                // 根据 query.name 进行筛选
                let filteredData = response.data.data;

                if (query.name) {
                    filteredData = filteredData.filter(item => item.name.includes(query.name));
                }

                // 根据 selectedStatus 进行筛选
                if (selectedStatus !== '全部状态') {
                    filteredData = filteredData.filter(item => item.status === selectedStatus);
                }
                console.log(filteredData);
                setData(filteredData);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, [query, selectedStatus])
    useEffect(() => {
        if (!isShow) {
            setCurrentId('');
        }
    }, [isShow])
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    const handleDelete = async (r) => {
        const permission = sessionStorage.getItem('permission');
        console.log(permission);
        if (permission === 'audit') {
            message.error('你没有删除权限');
        }
        else {
            if (r.is_delete === 1) {
                message.success('该游记已经被删除');
            } else {
                const storedToken = sessionStorage.getItem('token');
                axios.defaults.headers.common['Authorization'] = storedToken;

                const config = {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                };

                try {
                    const response = await axios.get('http://127.0.0.1:3007/my/task/delete/' + r.id, config);
                    console.log(response.data);
                    if (response.data.message === '删除成功') {
                        message.success('删除成功');
                    }
                } catch (error) {
                    console.error('Error:', error);
                }

                setQuery({});
            }
        }

    };
    const handlePass = async (r) => {
        if (r.status === '已通过') {
            message.success('该游记已经审核通过');
        } else {
            const storedToken = sessionStorage.getItem('token');
            axios.defaults.headers.common['Authorization'] = storedToken;
            const config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };
            try {
                const response = await axios.get('http://127.0.0.1:3007/my/task/pass/' + r.id, config);
                console.log(response.data);
                if (response.data.message === '审核通过') {
                    message.success('审核通过');
                }
            } catch (error) {
                console.error('Error:', error);
            }
            setQuery({});
        }
    };
    
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentData = data.slice(startIndex, endIndex);
    return (
        <>
            <Card
                title='游记管理'
            // extra={
            //     <>
            //         <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsShow(true)} />
            //     </>
            // }
            >
                <Form layout="inline" onFinish={(v) => {
                    setQuery(v)
                    message.success('查询成功')
                }}>
                    <Form.Item label="名称" name='name'>
                        <Input placeholder="请输入关键词"></Input>
                    </Form.Item>
                    <Form.Item>
                        <Select defaultValue="待审核" style={{ width: 120 }} onChange={value => setSelectedStatus(value)}>
                            <Option value="全部状态">全部状态</Option>
                            <Option value="待审核">待审核</Option>
                            <Option value="已通过">已通过</Option>
                            <Option value="已拒绝">已拒绝</Option>
                            {/* <Option value="已删除">已删除</Option> */}
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button htmlType="submit" type="primary" icon={<SearchOutlined />} />
                    </Form.Item>
                </Form>

                <Table
                    dataSource={currentData}
                    rowKey='id'
                    pagination={{
                        current: currentPage,
                        pageSize: pageSize,
                        total: data.length,
                        onChange: handlePageChange,
                    }}
                    columns={
                        [{
                            title: '封面',
                            dataIndex: 'pic_urls',
                            render: (picUrls: string[]) => (
                                <div>
                                    <img src={picUrls[0]} alt={'Pic'} style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                                </div>
                            ),
                        },
                        {
                            title: '编号',
                            dataIndex: 'id',
                        }, {
                            title: '名称',
                            dataIndex: 'name',
                        }, {
                            title: '游记标题',
                            dataIndex: 'title',
                        }, {
                            title: '状态',
                            dataIndex: 'status',
                        }, {
                            title: '是否删除',
                            dataIndex: 'is_delete',
                        }, {
                            title: '操作',
                            align: 'center',
                            width: 100,
                            render(v, r: any) {
                                return <Space>
                                    {/* <Button type='primary' icon={<EditOutlined />} onClick={() => {
                                            setIsShow(true)
                                            setCurrentId(r.id)
                                            // console.log(r.id)
                                            // myForm.setFieldsValue(r)
                                        }} /> */}
                                    <Tooltip title="拒绝">
                                        <Button
                                            type='primary'
                                            icon={<ExclamationCircleOutlined />}
                                            onClick={() => {
                                                setIsShow(true)
                                                setCurrentId(r.id)
                                            }}
                                        />
                                    </Tooltip>
                                    <Tooltip title="查看游记内容">
                                        <Button type='primary' icon={<ZoomInOutlined />} onClick={() => {
                                            setSelectedRowData(r);
                                            setIsInfoShow(true)
                                            // myForm.setFieldsValue(r)
                                        }} />
                                    </Tooltip>
                                    <Tooltip title="通过">
                                        <Popconfirm
                                            title="确认通过审核吗？"
                                            onConfirm={() => handlePass(r)}
                                            okText="是"
                                            cancelText="否"
                                        >
                                            <Button
                                                type='primary'
                                                icon={<CheckOutlined />}
                                                onClick={() => { }}
                                            />
                                        </Popconfirm>
                                    </Tooltip>
                                    <Tooltip title="删除">
                                        <Popconfirm
                                            title="确定要删除吗？"
                                            onConfirm={() => handleDelete(r)}
                                            okText="是"
                                            cancelText="否"
                                        >
                                            <Button
                                                type='primary'
                                                icon={<DeleteOutlined />}
                                                danger
                                            />
                                        </Popconfirm>
                                    </Tooltip>
                                </Space>
                            }
                        }
                        ]
                    } />
            </Card>
            <Modal
                title="编辑"
                open={isShow}
                maskClosable={false}
                onCancel={() => setIsShow(false)}
                destroyOnClose
                onOk={() => {
                    // message.success('上传成功');
                }}
            >
                <Form
                    preserve={false}
                    onFinish={async (v) => {
                        if (currentId) {
                            v.Id = currentId;
                            message.success('进行更新');
                            const storedToken = sessionStorage.getItem('token');
                            console.log(v);
                            axios.defaults.headers.common['Authorization'] = storedToken;

                            const config = {
                                headers: {
                                    'Content-Type': 'application/x-www-form-urlencoded'
                                }
                            };
                            await axios.post('http://127.0.0.1:3007/my/task/reject', new URLSearchParams(v), config)
                                .then(response => {
                                    console.log(response.data);
                                    if (response.data.message === '拒绝成功') {
                                        message.success('拒绝成功');
                                    }
                                })
                                .catch(error => {
                                    console.error('Error:', error);
                                });
                        }
                        setIsShow(false);
                        setCurrentId('');
                        setQuery({});//重置查询条件取数据
                    }}

                >
                    <Form.Item label='拒绝理由' name='reason' rules={
                        [
                            {
                                required: true,
                                message: '请输入拒绝理由'
                            }
                        ]
                    }>
                        <Input placeholder="请输入拒绝理由" />
                    </Form.Item>

                </Form>
            </Modal>
            <Modal
                title="查看详情"
                open={isInfoShow}
                maskClosable={false}
                onCancel={() => setIsInfoShow(false)}
                destroyOnClose
                footer={null}
            >
                <Show task={selectedRowData} />
            </Modal>
        </>


    )
}
export default CaseManage