import React, {useState, useEffect} from 'react';
import { Space, Table, Tag, Checkbox } from 'antd';
import Filters from './filters';

const forecasa_api_key = 'JcGtDHRCa2p4IfOhs13veg'
const USERNAME = "ujjwal77"
const PASSWORD = "admin77"

const BronzeLevelTable = () => {
    const [loading, setLoading] = useState(false);
    const [companies, setCompanies] = useState([]);
    const [filters, setFilters] = useState({});
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const [tableParams, setTableParams] = useState({
      pagination: {
        current: 1,
        pageSize: 200,
      },
    });

    // console.log(tableParams);

    // const limits = {page: 1, page_size: 10, api_key: forecasa_api_key}

    const fetchCompanyData = () => {
      console.log(filters);
      const {child_sponsor, company_tags, counties} = filters

      console.log(tableParams.pagination);
      const params = new URLSearchParams({
        page: tableParams.pagination.current, 
        page_size: tableParams.pagination.pageSize, 
        api_key: forecasa_api_key
      });

      if(company_tags){
        console.log("Adding company tags filter....")
        company_tags.forEach((tag) => {
          params.append('q[tags_name_in][]',tag);
        })
      }

      if(child_sponsor){
          console.log("Adding company name filter...")
          params.append('q[name_cont]', child_sponsor)
      }

      if(counties){
        counties.forEach((county) => {
          params.append('[transactions][q][county_in][]', county);
        })
          // filters['[transactions][q][county_in][]'] = values['counties'];
      }

      // console.log(params.toString());

      setLoading(true);
      fetch(`/api/v1/companies?` + params, { headers: { "Content-Type": "application/json"}})
      .then((res) => res.json())
      .then(({companies, companies_total_count}) => {
        setLoading(false);

        setTableParams({
          ...tableParams,
          pagination: {...tableParams.pagination, total: companies_total_count}
        })

        console.log(companies_total_count);
        console.log(companies);
        setCompanies(companies);
      })
    }

    useEffect(() => {
        fetchCompanyData();
    }, [JSON.stringify(tableParams)])
    // const companies = require('../data/companies.json')
    // console.log(companies)

    // const filteredCompanies = companies.slice(0, 10);

    const handleTableChange = (pagination) => {
      console.log(pagination);
      setTableParams({pagination: {...pagination}});
      console.log(tableParams);
      // fetchCompanyData();
    }

    const onSelectChange = (newSelectedRowKeys) => {
      console.log('selectedRowKeys changed: ', newSelectedRowKeys);
      setSelectedRowKeys(newSelectedRowKeys);
    };

    const handleRowSelection = (e, record) => {
      const { checked } = e.target;
      // if (checked) {
      //   setSelectedRows((prevSelectedRows) => [...prevSelectedRows, record.key]);
      // } else {
      //   setSelectedRows((prevSelectedRows) =>
      //     prevSelectedRows.filter((key) => key !== record.key)
      //   );
      // }
    };

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
          },
        // {
        //   title: 'Action',
        //   key: 'action',
        //   render: (_, record) => (
        //     <Space size="middle">
        //       <a>Invite {record.name}</a>
        //       <a>Delete</a>
        //     </Space>
        //   ),
        // },
    ];

    const rowSelection = {
      selectedRowKeys,
      onChange: onSelectChange,
      selections: [
        Table.SELECTION_ALL,
        Table.SELECTION_INVERT,
        Table.SELECTION_NONE
      ]
    }

    const handlePublish = async (value) => {
      // console.log("Came Here");
      // console.log(btoa(USERNAME + ':' + PASSWORD));

      // try{
      //     const response = await fetch('http://20.150.214.47:8000/company/add', {
      //         method: 'POST',
      //         headers: {
      //             "Content-Type": "application/json",
      //             "Authorization": 'Basic ' + btoa(USERNAME + ':' + PASSWORD)
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
      <>
        <Filters search={fetchCompanyData} setFilters={setFilters} handlePublish={handlePublish}/>
        <Table 
          // rowSelection={rowSelection}
          pagination={tableParams.pagination}
          rowKey={(company) => company.id} 
          columns={columns} 
          loading={loading}
          dataSource={companies}
          onChange={handleTableChange}
        />
      </>
    );
};

export default BronzeLevelTable;