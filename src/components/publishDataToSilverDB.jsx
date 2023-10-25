import React, {useState, useEffect} from 'react';
import { 
    Typography, 
    Table, 
    Tag, 
    Layout, 
    Space, 
    Form, 
    Col, 
    Row, 
    Button, 
    Tooltip,
    DatePicker,
    Slider
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { filterValue, getCompanies } from '../services/companyService';

const {RangePicker} = DatePicker;
const { Title } = Typography;
const { Header, Content } = Layout;

const initialFormValues = {
    mortgage_transactions: [0,0],
    average_mortgage_amount: [0,0],
    last_transaction_date: null,
    last_mortgage_date: null
}

const username = process.env.REACT_APP_API_USERNAME;
const password = process.env.REACT_APP_API_PASSWORD;

const PublishDataToSilverDB = (props) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [companies, setCompanies] = useState([]);
    const [filters, setFilters] = useState(initialFormValues);
    const [formRanges, setFormRanges] = useState({});

    const headerStyle = {
        textAlign: 'center',
        backgroundColor: '#fff',
    };

    const contentStyle = {
        textAlign: 'center',
        backgroundColor: '#fff',
    };

    const fetchCompanyData = async () => {
        const {last_mortgage_date, last_transaction_date, average_mortgage_amount, mortgage_transactions} = filters
        console.log(filters);


        const data = {
            limit: 200,
        }
  
        if(last_mortgage_date){
            const startDate = last_mortgage_date[0].format('YYYY-MM-DD');
            const endDate = last_mortgage_date[1].format('YYYY-MM-DD');
            data['last_mortgage_date'] = {
                "start_date": startDate,
                "end_date": endDate
            }
        }
  
        if(last_transaction_date){
            const startDate = last_mortgage_date[0].format('YYYY-MM-DD');
            const endDate = last_mortgage_date[1].format('YYYY-MM-DD');

            data['last_transaction_date'] = {
                "start_date": startDate,
                "end_date": endDate
            }
        }
  
        if(average_mortgage_amount){
            data['average_mortgage_amount'] = {
                "min_value": average_mortgage_amount[0],
                "max_value": average_mortgage_amount[1]
            }
        }

        if(mortgage_transactions){
            data['mortgage_transactions'] = {
                "min_value": mortgage_transactions[0],
                "max_value": mortgage_transactions[1]
            }
        }
        
        try{
            setLoading(true);
            
            // const response = await fetch('/company/filter', {
            //     method: 'POST',
            //     headers: {
            //         "Content-Type": "application/json",
            //         "Authorization": 'Basic ' + btoa(username + ':' + password)
            //     },
            //     body: JSON.stringify(data)
            // })

            // if (!response.ok) {
            //     throw new Error(response.statusText);
            // }

            // const result = await response.json();

            const result = await getCompanies(data);
            console.log(result);
            
            setCompanies(result.data.data);
            setLoading(false);
        }catch(error){
            setLoading(false);
            console.log(error);
        }
    }

    const fetchFiltersValue = async () => {
        try{
            setLoading(true);
            const response = await filterValue();
            const {data} = response.data;
            const {min_mortgage, max_mortgage, min_avg_mortgage_amount, max_avg_mortgage_amount} = data;
            setFilters({
                ...filters,
                mortgage_transactions: [min_mortgage, max_mortgage/2],
                average_mortgage_amount: [min_avg_mortgage_amount, max_avg_mortgage_amount/2]
            });

            form.setFieldValue('mortgage_transactions', [min_mortgage, max_mortgage/2]);
            form.setFieldValue('average_mortgage_amount', [min_avg_mortgage_amount, max_avg_mortgage_amount/2])
        
            setFormRanges(data);
            setLoading(false);
        }catch(error){
            setLoading(false);
            console.log(error);
        }
    }

    useEffect(() => {
        fetchFiltersValue();
    },[])

    const onFormSubmit = () => {
        fetchCompanyData();
    }

    const handleFormChange = (changedValues, allValues) => {
        console.log("Form Values Changes: ");
        console.log(allValues);
        setFilters(allValues);
    }

    
    // ######### Table Configuration #########
    const columns = [
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

    // ######### Handle Publish Configuration #########
    const handlePublish = async () => {
        // try{
        //     const response = await fetch('http://20.150.214.47:8000/company/add', {
        //         method: 'POST',
        //         headers: {
        //             "Content-Type": "application/json",
        //             "Authorization": 'Basic ' + btoa(username + ':' + password)
        //         },
        //         body: JSON.stringify({companies})
        //     })
  
        //     const result = await response.json();
        //     console.log("Success:", result);
        // }catch(error){
        //     console.error("Error:", error);
        // }
    } 


    return (
        <Space direction="vertical" style={{ width: '100%'}}>
            <Layout>
                <Header style={headerStyle}>
                    <Title level={2}>Publish Data To Silver DB</Title>
                </Header>

                <Content style={contentStyle}>
                    <Form initialValues={initialFormValues} style={{textAlign: 'left'}} form={form} name='filters' layout='vertical' onValuesChange={handleFormChange} onFinish={onFormSubmit}>
                        <Row  justify="space-between" align="bottom">
                            <Col span={5}>
                                <Form.Item style={{ marginRight: '10px' }} label={<label style={{ fontStyle: "bold" }}>Last Mortgage Date</label>} name="last_mortgage_date">
                                    <RangePicker format={'YYYY/MM/DD'} size='large'/>
                                </Form.Item>
                            </Col>
                            <Col span={5}>
                                <Form.Item style={{ marginRight: '10px' }} label={<label style={{ fontStyle: "bold" }}>Last Transaction Date</label>} name="last_transaction_date">
                                        <RangePicker size='large'/>
                                </Form.Item>
                            </Col>
                            <Col span={5}>
                                <Form.Item style={{ marginRight: '10px' }} label={<label style={{ fontStyle: "bold" }}>Average Mortgage Amount</label>} name="average_mortgage_amount">
                                    <Slider tooltip={{open: true, placement: 'bottom'}} range min={0} max={formRanges.max_avg_mortgage_amount} />
                                </Form.Item>
                            </Col>
                            <Col span={5}>
                                <Form.Item label={<label style={{ fontStyle: "bold" }}>Mortgage Transactions </label>} name="mortgage_transactions">
                                    <Slider min={0} max={formRanges.max_mortgage} range />
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
                                        <Button disabled={loading || companies.length == 0} onClick={handlePublish} size='large' type="primary">
                                            Publish
                                        </Button>
                                    </Tooltip>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>

                    <Table 
                        rowKey={(company) => company.company_id} 
                        columns={columns} 
                        loading={loading}
                        dataSource={companies}
                    />
                </Content>
            </Layout>
        </Space>
    );
}

export default PublishDataToSilverDB;