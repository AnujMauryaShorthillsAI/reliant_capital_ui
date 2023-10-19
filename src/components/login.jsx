import React from 'react';
import {Form, Input, Button, Row, Col, Layout, Space, Typography} from 'antd';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const {Header, Content} = Layout
const { Title } = Typography
const labelStyling = { 
    fontSize: '16px', 
    fontWeight: 'bold', 
    color: '#333' 
};
const forecasa_api_key = process.env.REACT_APP_FORECASA_API_KEY;

const Login = ({setLoggedIn}) => {
    const USERNAME = 'admin'
    const PASSWORD = 'password123'

    const [form] = Form.useForm();
    const navigate = useNavigate()

    const onFinish = async (values) => {
        if(values['username'] == USERNAME && values['password'] == PASSWORD){
            console.log("Logged In successfully");
            setLoggedIn(true);
            await fetchStates();
            navigate('/publish');
        }else{
            form.setFields([
                {
                    name: 'password',
                    errors: ['Username and password do not match'],
                },
            ]);
        }
    };
    

    // Work Around
    const fetchStates = async() => {
        const params = new URLSearchParams({
            api_key: forecasa_api_key
        });

        try{
            const response = await fetch(`/api/v1/geo/counties_by_states?`+params);
            
            if (!response.ok) {
                throw new Error(response.statusText);
            }
        }catch(error){
            console.error(error);
        }
    }

    const onReset = () => {
        form.resetFields();
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const headerStyle = {
        textAlign: 'center',
        backgroundColor: '#fff',
    };

    const contentStyle = {
        textAlign: 'center',
        backgroundColor: '#fff',
    };

    return (
        <Space direction="vertical" style={{ width: '100%'}}>
            <Layout>
                <Header style={headerStyle}>
                    <Title level={2}>User Login Form</Title>
                </Header>

                <Content style={contentStyle}>
                    <Row justify="center">
                        <Col span={8} style={{marginTop: '20px'}}>
                            <Form
                                form={form}
                                name="basic"
                                labelCol={{span: 8}}
                                wrapperCol={{span: 16}}
                                style={{maxWidth: 600}}
                                onFinish={onFinish}
                                onFinishFailed={onFinishFailed}
                                autoComplete="off"
                            >
                                <Form.Item
                                    label={<label style={labelStyling}>Username</label>}
                                    name="username"
                                    rules={[
                                        {
                                        required: true,
                                        message: 'Please input your username!',
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            
                                <Form.Item
                                    label={<label style={labelStyling}>Password</label>}
                                    name="password"
                                    rules={[
                                        {
                                        required: true,
                                        message: 'Please input your password!',
                                        },
                                    ]}
                                >
                                    <Input.Password />
                                </Form.Item>
                            
                            
                                <Form.Item
                                    wrapperCol={{
                                        offset: 8,
                                        span: 16,
                                    }}
                                    style={{textAlign: 'left'}}
                                >
                                    <Button size='large' style={{marginRight: '10px'}} type="primary" htmlType="submit">
                                        Submit
                                    </Button>
                                    <Button size='large' htmlType="button" onClick={onReset}>
                                        Reset
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Col>
                    </Row>
                </Content>
            </Layout>
        </Space>
    );
};

export default Login;