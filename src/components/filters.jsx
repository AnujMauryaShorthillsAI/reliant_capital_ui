import React, {useState, useEffect} from 'react';
import {Form, Input, Select, Col, Row, Button, Tooltip, DatePicker} from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;

const { Option } = Select

// const forecasa_url = 'https://webapp.forecasa.com/api/v1'
// const forecasa_api_key = 'JcGtDHRCa2p4IfOhs13veg'
const COMPANY_TAGS = [
    "private_lender", 
    "borrower", 
    "conventional_lender_working_with_llcs", 
    "private_loan_buyer", 
    "investor", 
    "fannie_freddie_lender", 
    "loan_seller", 
    "family_trust", 
    "individual_lender", 
    "non_qm_lender", 
    "insurance", 
    "self_directed_ira", 
    "sec_filer", 
    "form_d_filer", 
    "form_abs_filer", 
    "commercial_lender", 
    "sba_lender", 
    "nyse_listed_closed_end_fund", 
    "home_builder", 
    "reit", 
    "investor_no_mortgage", 
    "capital_placement", 
    "comm_re_cap_placement", 
    "residential_re_cap_placement"
]

const Filters = ({type, search, setFilters, handlePublish}) => {
    const [states, setStates] = useState([]);
    const [form] = Form.useForm();

    const handleFormChange = (changedValues, allValues) => {
        console.log(allValues);
        setFilters(allValues)
    }

    const fetchStates = () => {
        fetch(`/api/v1/geo/counties_by_states`)
        .then((res) => res.json())
        .then(({states}) => setStates(states))
    }

    useEffect(() => {
        fetchStates();
    },[])

    // const data = require('../data/states.json');
    // // const states = data['states']
    // let counties = [];
    // // counties = counties.concat(1,2,3,4)
    // states.forEach((state) => {
    //     // console.log(state["children"]);
    //     counties = counties.concat(state["children"]);
    //     // console.log(counties);
    // })

    const handleStateChange = (selectedStates) => {
        const counties = []

        for(const _state of selectedStates){
            for(const state of states){
                if(state["label"] === _state){
                    for(const count of state["children"]){
                        counties.push(count["value"])
                    }
                    // state["children"].forEach((county) => counties.push(county["value"]));
                    break;
                }
            }
        }

        console.log(counties);
        form.setFieldValue('counties', counties)
        
        setFilters({...form.getFieldsValue()})
        // setInitialValues({...initialValues, counties: counties})
        // setSelectedValue(counties);
        // console.log(selectedValue);
    }

    const handleCompanyTagChange = (value) => {
        // console.log(value)
    }

    const handleCountyChange = (value) => {
        console.log(value);
    }

    const onSubmit = (values) => {
        // const filters = {
        //     page: 1, 
        //     page_size: 10, 
        //     api_key: forecasa_api_key
        // }

        // if(values["company_tags"] && values['company_tags'].length > 0){
        //     console.log("Adding company tags filter....")
        //     filters['q[tags_name_in][]'] = values['company_tags']
        // }

        // if(values["child_sponsor"]){
        //     console.log("Adding company name filter...")
        //     filters['q[name_cont]'] = values['child_sponsor']
        // }

        // if(values["counties"] && values['counties'].length > 0){
        //     filters['[transactions][q][county_in][]'] = values['counties'];
        // }

        // console.log(filters);

        // setFilters(values);
        search();
        // fetchCompanyData();
        // console.log('Received values of form: ', values)
    }
    
    if(type == 'publish')
        return (
            <Form form={form} name='filters' layout='vertical' onValuesChange={handleFormChange} onFinish={onSubmit}>
                <Row  justify="space-evenly" align="bottom">
                    <Col span={5}>
                        <Form.Item style={{ marginRight: '10px' }} label={<label style={{ fontStyle: "bold" }}>Child Sponsor</label>} name="child_sponsor">
                            <Input placeholder='Child Sponsor' size='large'/>
                        </Form.Item>
                    </Col>
                    {/* <Col span={5}>
                        <Form.Item style={{ marginRight: '10px' }} label={<label style={{ fontStyle: "bold" }}>Street Address</label>} name="address">
                            <Input placeholder='Street Address' size='large'/>
                        </Form.Item>
                    </Col>
                    <Col span={5}>
                        <Form.Item style={{ marginRight: '10px' }} label={<label style={{ fontStyle: "bold" }}>Unit</label>} name="unit">
                            <Input placeholder='Unit' size='large'/>
                        </Form.Item>
                    </Col> */}
                    <Col span={5}>
                        <Form.Item style={{ marginRight: '10px' }} label={<label style={{ fontStyle: "bold" }}>Company Tag</label>} name="company_tags" >
                            <Select onChange={handleCompanyTagChange} mode='multiple' placeholder='Please Select' size='large' maxTagCount='responsive'>
                                {
                                    COMPANY_TAGS.map((tag) => (
                                        <Option key={tag} value={tag}>
                                            {tag.replaceAll('_',' ').toUpperCase()}
                                        </Option>
                                    ))
                                }
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={5}>
                        <Form.Item style={{ marginRight: '10px' }} label={<label style={{ fontStyle: "bold" }}>State</label>} name="states">
                            <Select onChange={handleStateChange} mode='multiple' placeholder='Please Select' size='large' maxTagCount='responsive'>
                                {
                                    states.map((state) => (
                                        <Option key={state['value']} value={state['label']}>
                                            {state['label']}
                                        </Option>
                                    ))
                                }
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Form.Item label={<label style={{ fontStyle: "bold" }}>County</label>} name="counties">
                            <Select onChange={handleCountyChange} mode='multiple' placeholder='Please Select' size='large'  maxTagCount='responsive'>
                                {
                                    states.map((state) => (
                                        // console.log(state['children']);
                                        state['children'].map((county) => {
                                            return <Option key={county['value']} value={county['value']}>
                                                {county['label']}
                                            </Option>
                                        })
                                    ))
                                }
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col align="middle" span={2}>
                        <Form.Item>
                            <Button size='large' type="primary" htmlType="submit" icon={<SearchOutlined />}>
                                Search
                            </Button>
                        </Form.Item>
                    </Col>
                    <Col align="middle" span={2}>
                        <Form.Item>
                        <Tooltip title="publish current page data">
                            <Button onClick={handlePublish} size='large' type="primary">
                                Publish
                            </Button>
                        </Tooltip>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        );
    else return (
        <Form form={form} name='filters' layout='vertical' onValuesChange={handleFormChange} onFinish={onSubmit}>
                <Row  justify="space-evenly" align="bottom">
                    <Col span={5}>
                        <Form.Item style={{ marginRight: '10px' }} label={<label style={{ fontStyle: "bold" }}>Child Sponsor</label>} name="child_sponsor">
                            <RangePicker size='large'/>
                        </Form.Item>
                    </Col>
                    {/* <Col span={5}>
                        <Form.Item style={{ marginRight: '10px' }} label={<label style={{ fontStyle: "bold" }}>Street Address</label>} name="address">
                            <Input placeholder='Street Address' size='large'/>
                        </Form.Item>
                    </Col>
                    <Col span={5}>
                        <Form.Item style={{ marginRight: '10px' }} label={<label style={{ fontStyle: "bold" }}>Unit</label>} name="unit">
                            <Input placeholder='Unit' size='large'/>
                        </Form.Item>
                    </Col> */}
                    <Col span={5}>
                        <Form.Item style={{ marginRight: '10px' }} label={<label style={{ fontStyle: "bold" }}>Company Tag</label>} name="company_tags" >
                            <Select onChange={handleCompanyTagChange} mode='multiple' placeholder='Please Select' size='large' maxTagCount='responsive'>
                                {
                                    COMPANY_TAGS.map((tag) => (
                                        <Option key={tag} value={tag}>
                                            {tag.replaceAll('_',' ').toUpperCase()}
                                        </Option>
                                    ))
                                }
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={5}>
                        <Form.Item style={{ marginRight: '10px' }} label={<label style={{ fontStyle: "bold" }}>State</label>} name="states">
                            <Select onChange={handleStateChange} mode='multiple' placeholder='Please Select' size='large' maxTagCount='responsive'>
                                {
                                    states.map((state) => (
                                        <Option key={state['value']} value={state['label']}>
                                            {state['label']}
                                        </Option>
                                    ))
                                }
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Form.Item label={<label style={{ fontStyle: "bold" }}>County</label>} name="counties">
                            <Select onChange={handleCountyChange} mode='multiple' placeholder='Please Select' size='large'  maxTagCount='responsive'>
                                {
                                    states.map((state) => (
                                        // console.log(state['children']);
                                        state['children'].map((county) => {
                                            return <Option key={county['value']} value={county['value']}>
                                                {county['label']}
                                            </Option>
                                        })
                                    ))
                                }
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col align="middle" span={2}>
                        <Form.Item>
                            <Button size='large' type="primary" htmlType="submit" icon={<SearchOutlined />}>
                                Search
                            </Button>
                        </Form.Item>
                    </Col>
                    <Col align="middle" span={2}>
                        <Form.Item>
                        <Tooltip title="publish current page data">
                            <Button onClick={handlePublish} size='large' type="primary">
                                Publish
                            </Button>
                        </Tooltip>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
    )
};

export default Filters;