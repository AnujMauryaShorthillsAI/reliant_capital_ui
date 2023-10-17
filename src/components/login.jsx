import React, {useState, useEffect} from 'react';
import {Form, Input, Button, Row, Col} from 'antd';
import { useNavigate } from 'react-router-dom';

const Login = ({setLoggedIn}) => {
    const USERNAME = 'admin'
    const PASSWORD = 'password123'

    const [form] = Form.useForm();
    const navigate = useNavigate()
    const onFinish = (values) => {
        if(values['username'] == USERNAME && values['password'] == PASSWORD){
            console.log("Logged In successfully");
            setLoggedIn(true);

            navigate('/publish')
            // return <Navigate to="/publish"/>
        }else{
            form.setFields([
                {
                    name: 'password',
                    errors: ['Username and password do not match'],
                },
            ]);
        }

        console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Row justify="center" align="top" style={{ minHeight: '100vh' }}>
            <Col span={8}>
                <Form
                form={form}
                name="basic"
                labelCol={{
                span: 8,
                }}
                wrapperCol={{
                span: 16,
                }}
                style={{
                maxWidth: 600,
                }}
                initialValues={{
                remember: true,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                label="Username"
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
                label="Password"
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
            
                {/* <Form.Item
                name="remember"
                valuePropName="checked"
                wrapperCol={{
                    offset: 8,
                    span: 16,
                }}
                >
                <Checkbox>Remember me</Checkbox>
                </Form.Item> */}
            
                <Form.Item
                wrapperCol={{
                    offset: 8,
                    span: 16,
                }}
                >
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
                </Form.Item>
            </Form>
            </Col>
        </Row>
    );
};

export default Login;