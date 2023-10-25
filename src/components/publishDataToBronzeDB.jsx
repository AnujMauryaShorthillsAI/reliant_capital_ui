/**
    Author : Anuj Maurya
    Description: Displaying data using forecasa api and publish it to the bronze db.
    Version : 1.0
    Date: 18-10-2023
    Azure Ticket Link : https://dev.azure.com/Generative-AI-Training/GenerativeAI/_workitems/edit/115/
**/
import React, {useState, useEffect} from 'react';
import { 
    Typography, 
    Table, 
    Tag, 
    Layout, 
    Space, 
    Form, 
    Input, 
    Select, 
    Col, 
    Row, 
    Button, 
    Tooltip,
    Spin,
    notification
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { getStates, getCompanies} from '../services/forecasaService';
import { saveCompanies } from '../services/companyService';

const { Title } = Typography;
const { Header, Content } = Layout;
const { Option } = Select

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

const headerStyle = {
    textAlign: 'center',
    backgroundColor: '#fff',
};

const contentStyle = {
    textAlign: 'center',
    backgroundColor: '#fff',
};

const initialFormValues = {
    child_sponsor: '',
    company_tags: [],
    counties: [],
    states: []
}

const forecasa_api_key = process.env.REACT_APP_FORECASA_API_KEY;
const username = process.env.REACT_APP_API_USERNAME;
const password = process.env.REACT_APP_API_PASSWORD;

const PublishDataToBronzeDB = (props) => {
    const [states, setStates] = useState([]);
    const [form] = Form.useForm();
    const [isFormValid, setFormValidation] = useState(false);
    const [loadingCompanies, setLoadingCompanies] = useState(false);
    const [publishingData, setPublishingData] = useState(false);
    const [companies, setCompanies] = useState([]);
    const [filters, setFilters] = useState({});
    const [api, contextHolder] = notification.useNotification();
    // const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    // const [tableParams, setTableParams] = useState({
    //     pagination: {
    //         current: 1,
    //         pageSize: 100,
    //     },
    // });

    const fetchStates = async() => {
        // const params = new URLSearchParams({
        //     // api_key: forecasa_api_key
        // });

        try{
            const response = await getStates();
            const {states} = response;
            setStates(states);
        }catch(error){
            console.error(error);
        }
    }

    const fetchCompanyData = async () => {
        const {child_sponsor, company_tags, counties} = filters;
  
        // console.log(tableParams.pagination);
        // const params = new URLSearchParams({
        //   page: tableParams.pagination.current, 
        //   page_size: tableParams.pagination.pageSize, 
        //   api_key: forecasa_api_key
        // });

        // const params = new URLSearchParams({
        //     page: 1, 
        //     page_size: 200, 
        //     // api_key: forecasa_api_key
        // });
  
        // if(company_tags){
        //   console.log("Adding company tags filter....")
        //   company_tags.forEach((tag) => {
        //     params.append('q[tags_name_in][]',tag);
        //   })
        // }
  
        // if(child_sponsor){
        //     console.log("Adding company name filter...")
        //     params.append('q[name_cont]', child_sponsor)
        // }
  
        // if(counties){
        //   counties.forEach((county) => {
        //     params.append('[transactions][q][county_in][]', county);
        //   })
        // }

        const payload = {...filters, page: 1, pageSize: 1};
        try{
            setLoadingCompanies(true);

            const response = await getCompanies(payload);
            const {companies, companies_total_count} = response;
            setCompanies(companies);

            setLoadingCompanies(false);
        }catch(error){
            setLoadingCompanies(false);
            console.error(error);
        }
        
  
        // setTableParams({
        //     ...tableParams,
        //     pagination: {...tableParams.pagination}
        // })

        // console.log(companies_total_count);
        // console.log(companies);
        
    }

    useEffect(() => {
        fetchStates();
    },[])


    const handleStateChange = (selectedStates) => {
        const counties = []

        selectedStates.forEach((selectedState) => {
            const state = states.find((currState) => currState.label == selectedState);
            state.children.forEach((county) => counties.push(county["value"]))
        })

        form.setFieldValue('counties', counties);
        
        setFilters({...form.getFieldsValue()});

        validateForm();
    }

    const onFormSubmit = () => {
        fetchCompanyData();
    }

    const handleFormChange = (changedValues, allValues) => {
        validateForm();
        console.log("############## Form Values ##############");
        console.log(allValues);
        setFilters(allValues);
    }

    const validateForm = () => {
        const {child_sponsor, company_tags, counties} = form.getFieldsValue();
        const isFormValid = child_sponsor || company_tags.length > 0 || counties.length > 0;
        if(!isFormValid) setCompanies([]);
        setFormValidation(isFormValid);
    }

    // ######### Table Configuration #########
    const columns = [
        // {
        //   title: '',
        //   dataIndex: 'checkbox',
        //   render: (_, record) => (
        //     <Checkbox
        //       onChange={(e) => handleRowSelection(e, record)}
        //       checked={selectedRowKeys.includes(record.key)}
        //     />
        //   ),
        // },
          {
            title: 'Name',
            key: 'name',
            dataIndex: 'name',
            render: (text) => <a>{text.toUpperCase()}</a>,
          },
          {
            title: 'Address',
            key: 'address',
            dataIndex: 'principal_address',
            render: (address) => {
              return (address == null)? <span> -- </span> : <span>{address}</span>
            }
          },
          {
            title: 'Tags',
            key: 'tags',
            dataIndex: 'tag_names',
            render: (tag_names) => (
              <>
                {tag_names.map((tag) => {
                  let color = tag.length > 7 ? 'geekblue' : 'green';
                  if (tag === 'borrower') {
                    color = 'volcano';
                  }
                  return (
                    <Tag color={color} key={tag}>
                      {tag.toUpperCase()}
                    </Tag>
                  );
                })}
              </>
            ),
          },
          {
              title: 'Average Mortgage Amount',
              className: 'column-money',
              key: 'amount',
              dataIndex: 'average_mortgage_amount',
              render: (amount) => (
                  (amount == null)? `$ ${0}` : `$ ${amount}`
              )
            }
    ];

    // ######### Row Selection Configuration #########
    // const rowSelection = {
    //     selectedRowKeys,
    //     onChange: onSelectChange,
    //     selections: [
    //       Table.SELECTION_ALL,
    //       Table.SELECTION_INVERT,
    //       Table.SELECTION_NONE
    //     ]
    // }

    // const onSelectChange = (newSelectedRowKeys) => {
    //     console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    //     setSelectedRowKeys(newSelectedRowKeys);
    // };

    // ######### Pagination Configuration #########
    // const handleTableChange = (pagination) => {
    //     console.log(pagination);
    //     setTableParams({pagination: {...pagination}});
    // }

    // ######### Handle Publish Configuration #########
    const handlePublish = async () => {
        try{
            setPublishingData(true);
            const response = await saveCompanies({companies});

            console.log("Response got while saving data.");
            console.log(response.message);

            setPublishingData(false);
            openNotification('topRight', 'Data Ingestion Successful!')
        }catch(error){
            setPublishingData(false);
            openNotification('topRight', 'Something Went Wrong!')
            console.error("Error:", error);
        }
    }

    const openNotification = (placement, message) => {
        api.info({
          message: `Notification`,
          description: message,
          placement,
          duration: 3,
        });
    };

    return (
        <>
            {contextHolder}
            <Space direction="vertical" style={{ width: '100%'}}>
                <Layout>
                    <Header style={headerStyle}>
                        <Title level={2}>Publish Data To Bronze DB</Title>
                    </Header>
                    <Spin spinning={publishingData} size='large' tip='Publishing Data...'>
                        <Content style={contentStyle}>
                            <Form initialValues={initialFormValues} style={{textAlign: 'left'}} form={form} name='filters' layout='vertical' onValuesChange={handleFormChange} onFinish={onFormSubmit}>
                                <Row  justify="space-between" align="bottom">
                                    <Col span={5}>
                                        <Form.Item style={{ marginRight: '10px' }} label={<label style={{ fontStyle: "bold" }}>Child Sponsor</label>} name="child_sponsor">
                                            <Input placeholder='Child Sponsor' size='large'/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={5}>
                                        <Form.Item style={{ marginRight: '10px' }} label={<label style={{ fontStyle: "bold" }}>Company Tag</label>} name="company_tags" >
                                            <Select mode='multiple' placeholder='Please Select' size='large' maxTagCount='responsive'>
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
                                            <Select mode='multiple' placeholder='Please Select' size='large'  maxTagCount='responsive'>
                                                {
                                                    states.map((state) => (
                                                        // console.log(state['children']);
                                                        state['children'].map((county) => {
                                                            return <Option key={county['value']} value={county['value']}>
                                                                {county['label'] + ` (${state['label']})`}
                                                            </Option>
                                                        })
                                                    ))
                                                }
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col align="middle" span={2}>
                                        <Form.Item>
                                            <Button disabled={!isFormValid} size='large' type="primary" htmlType="submit" icon={<SearchOutlined />}>
                                                Search
                                            </Button>
                                        </Form.Item>
                                    </Col>
                                    <Col align="middle" span={2}>
                                        <Form.Item>
                                        <Tooltip title="Publish Data">
                                            <Button  onClick={handlePublish} size='large' type="primary">
                                                Publish
                                            </Button>
                                        </Tooltip>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Form>

                            <Table 
                                // rowSelection={rowSelection}
                                // pagination={tableParams.pagination}
                                rowKey={(company) => company.id} 
                                columns={columns} 
                                loading={loadingCompanies}
                                dataSource={companies}
                                // onChange={handleTableChange}
                            />
                        </Content>
                    </Spin>
                </Layout>
            </Space>
        </>
    );
}

export default PublishDataToBronzeDB;