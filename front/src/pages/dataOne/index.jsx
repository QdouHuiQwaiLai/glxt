import React , { useState,  useRef, useEffect } from 'react';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Upload, Divider, Input, Modal, notification } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Popconfirm, message } from 'antd';
import ProTable from '@ant-design/pro-table';
import objectIdToTimestamp from 'objectid-to-timestamp'
import { queryStudentList, getSchoolList, deleteStudent } from './service';
import SelectSchool from './selectSchool'
import Selected from './selected'
import provinceList from '../../components/province'
import {  Space } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
const { TextArea } = Input;

export default () => {
  const [studentList, setstudentList] = useState([])
  const [schoolList, setSchoolList] = useState([])
  // const [updateContent, setUpdateContent] = useState("xadadadad")
  const actionRef = useRef();
  // const textArea = useRef()


  const getStudentList = async params => {
    params.sid = params.school
    delete params.school
    const schoolData =  await getSchoolList()
    setSchoolList(schoolData.data)
    const studentData =  await queryStudentList(params)
    const studentDataList = parsestudentList(studentData, schoolData)
    setstudentList(studentDataList.data)
    return studentDataList
  }

  const parsestudentList = (studentData, schoolData) => {
    for(let i = 0; i < studentData.data.length; i++) {
      studentData.data[i].score = parseInt(studentData.data[i].score)
      studentData.data[i].feascore = parseInt(studentData.data[i].feascore)
      studentData.data[i].mathsocre = parseInt(studentData.data[i].mathsocre)
      studentData.data[i].foreignscore = parseInt(studentData.data[i].foreignscore)
      for (let j = 0; j < schoolData.data.length; j++) {
        if (studentData.data[i].sid === schoolData.data[j].id) {
          studentData.data[i].school = {}
          studentData.data[i].school.id = schoolData.data[j].id
          studentData.data[i].school.name = schoolData.data[j].name
        }
      }
    } 
    studentData.data
    return studentData
  }


  const deleteStudentHandle = async (id,) => {
    const deleteStudenth =  async (id, ) => {
      const response = await deleteStudent({"stId": id, })
      if (response.code === 0) {
        notification.success({
          message: '删除成功',
        })
        if (actionRef.current) {
          actionRef.current.reload();
        }
      }
    }
    Modal.confirm({
      title: '是否确认删除?',
      icon: <ExclamationCircleOutlined />,
      // content: '删除会失去此次导入的所有学生信息',
      okText: '是',
      okType: 'danger',
      cancelText: '否',
      onOk() {
        deleteStudenth(id)
      },
      onCancel() {

      },
    });
  }

  // const showDetails = (record) => {
  //   const Bbb = ({ onChange, record }) => {
  //     const [value, setValue] = useState('');
      
  //     useEffect(() => {
  //       if (onChange) {
  //         onChange(value);
  //       }
  //     }, [value, onChange]);

  //     return (
  //       <TextArea
  //         value={value}
  //         onChange={event => setValue(event.target.value)}
  //       />
  //     );
  //   };
  //   const update =  async (params ) => {
  //     console.log(params)
  //     // const response = await deleteStudent({"stId": id, })
  //     // if (response.code === 0) {
  //     //   notification.success({
  //     //     message: '删除成功',
  //     //   })
  //     //   if (actionRef.current) {
  //     //     actionRef.current.reload();
  //     //   }
  //     // }
  //   }
  //   let content = ''
  //   let ccc = JSON.stringify(record)
  //   let a = ''
  //   const changeHandle = (e) => {
  //     console.log(e.target.value)
  //     setUpdateContent(e.target.value)
  //   }
  //   Modal.success({
  //     title: '修改信息',
  //     content: <Bbb
  //     record={record}
  //     onChange={(v) => {
  //       console.log(v)
  //       // setUpdateContent(e.target.value)
  //     }} 
  //     />,
  //     okText: '确定',
  //     onOk() {
  //       // console
  //       // console.log(textArea.current)
  //       // console.log(textArea.current.props.value)
  //       console.log('111111')
  //     },
  //   });
  // }


  const parseColumn = (item, record, param) => {
    let text = ''
    schoolList.forEach((school) => {
      if (record.school.id === school.id) {
        school.data.forEach((data) => {
          if (record.year === data.year) {
            if (param === 'profession'){
              text = data[param][item].name
              return
            }
            text = data[param][item]
            return
          }
        })
        return
      }
    })
    return text
  }
  
  const parseSearchColunmn = (form, param) => {
    const schoolId = form.getFieldValue('school')
    const year = form.getFieldValue('year')
    let list = []
    schoolList.forEach(school => {
      if (schoolId === school.id) {
        school.data.forEach((data) => {
          if (year === data.year) {
            list = data[param]
          }
        })
      }   
    })
    return (
      <Selected 
        list={list}
        onChange={selectedName => {
        void (form.setFieldsValue({param: selectedName}))}
      }/>
    )
  }

  const columns = [
    {
      title: '编号',
      dataIndex: 'key',
      hideInForm: true,
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: 'originalId',
      dataIndex: 'originalId',
      hideInForm: true,
      // hideInSearch: true,
    },
    {
      title: '学校',
      dataIndex: 'school',
      valueType: 'text',
      renderText: (item,{value,onChange}) => item.name,
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        // console.log(schoolList)
        return (
        <SelectSchool 
        schoolList={schoolList}
        onChange={selectedName => {
          void (form.setFieldsValue({"school": selectedName}))}
        }
          />
      )},
      rules: [
        {
          required: true,
          message: '规则名称为必填项',
        },
      ],
    },
    {
      title: '年份',
      dataIndex: 'year',
      valueType: 'digit',
      rules: [
        {
          required: true,
          message: '规则名称为必填项',
        },
      ],
    },
    {
      title: '科类',
      dataIndex: 'branch',
      hideInForm: true,
      renderText: (item, record) => { 
        return parseColumn(item, record, 'branch')
      },
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
          return parseSearchColunmn(form, "branch")
      },
    },
    {
      title: '性别',
      dataIndex: 'gender',
      hideInForm: true,
      renderText: (item, record) => { 
        return item === 1 ? '男' : '女'
      },
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        return (
          <Selected 
            list={['男', '女']}
            onChange={selectedName => {
            void (form.setFieldsValue({param: selectedName}))}
          }/>
        )
      },
    },
    {
      title: '省份',
      dataIndex: 'province',
      hideInForm: true,
      // hideInSearch: true,
      renderText: (item, record) => { 
        return provinceList[item].name
      },
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        let list = []
        provinceList.forEach(item => {
          list.push(item.name)
        })
        return (
          <Selected 
            list={list}
            onChange={selectedName => {
            void (form.setFieldsValue({param: selectedName}))}
          }/>
        )
      },
    },
    {
      title: '计划种类',
      dataIndex: 'plan',
      hideInForm: true,
      renderText: (item, record) => { 
        return parseColumn(item, record, 'plan')
      },
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        return parseSearchColunmn(form, "plan")
      },
    },
    {
      title: '外语语种',
      dataIndex: 'language',
      hideInForm: true,
      renderText: (item, record) => { 
        return parseColumn(item, record, 'language')
      },
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        return parseSearchColunmn(form, "language")
      },
    },
    {
      title: '政治面貌',
      dataIndex: 'political',
      hideInForm: true,
      renderText: (item, record) => { 
        return parseColumn(item, record, 'political')
      },
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        return parseSearchColunmn(form, "political")
      },
    },
    {
      title: '特长',
      dataIndex: 'feature',
      hideInForm: true,
      renderText: (item, record) => { 
        return parseColumn(item, record, 'feature')
      },
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        return parseSearchColunmn(form, "feature")
      },
    },
    {
      title: '专业',
      dataIndex: 'profession',
      hideInForm: true,
      renderText: (item, record) => { 
        return parseColumn(item, record, 'profession')
      },
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        const schoolId = form.getFieldValue('school')
        const year = form.getFieldValue('year')
        let list = []
        schoolList.forEach(school => {
          if (schoolId === school.id) {
            school.data.forEach((data) => {
              if (year === data.year) {
                list = data['profession']
              }
            })
          }   
        })
        let newList = []
        list.forEach(item => {
          newList.push(item.name)
        })
        return (
          <Selected 
            list={newList}
            onChange={selectedName => {
            void (form.setFieldsValue({param: selectedName}))}
          }/>
        )
      },
    },
    {
      title: '是否报道',
      dataIndex: 'flag',
      hideInForm: true,
      renderText: (item, record) => { 
        return item ? '是' : '否'
      },
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        return (
          <Selected 
            list={['是', '否']}
            onChange={selectedName => {
            void (form.setFieldsValue({param: selectedName}))}
          }/>
        )
      },
    },
    {
      title: '是否过重点线',
      dataIndex: 'line',
      hideInForm: true,
      renderText: (item, record) => { 
        return item ? '是' : '否'
      },
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        return (
          <Selected 
            list={['是', '否']}
            onChange={selectedName => {
            void (form.setFieldsValue({param: selectedName}))}
          }/>
        )
      },
    },
    {
      title: '专业志愿号',
      dataIndex: 'provolunteer',
      hideInForm: true,
    },
    {
      title: '高考成绩',
      dataIndex: 'score',
      hideInForm: true,
      hideInSearch: true,
    },
    {
      title: '特征成绩',
      dataIndex: 'feascore',
      hideInForm: true,
      hideInSearch: true,
    },
    {
      title: '数学成绩',
      dataIndex: 'mathsocre',
      hideInForm: true,
      hideInSearch: true,
    },
    {
      title: '外语成绩',
      dataIndex: 'foreignscore',
      hideInForm: true,
      hideInSearch: true,
    },
    {
      title: '导入编号',
      dataIndex: 'taskFile',
      hideInForm: true,
      // hideInTable: true,
      // hideInSearch: true,
    },
    {
      title: '导入时间',
      dataIndex: 'id',
      valueType: 'dateTime',
      hideInForm: true,
      hideInSearch: true,
      renderText: (item,{value,onChange}) =>  {
        return objectIdToTimestamp(item)
      }
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => { 
        return (
        <>
          {/* <a
            onClick={() => {
              // setUpdateContent(JSON.stringify(record))
              // setUpdateContent('dsdadasdasd')
              showDetails(record);
            }}
          >
            详情
          </a>
          <Divider type="vertical" /> */}
          <a 
            onClick={() => {
              deleteStudentHandle(record.id)
             }}
          >删除</a>
        </>
      )},
    },
  ];


  return (
    <PageHeaderWrapper title={false}>
      <ProTable
        actionRef={actionRef}
        columns={columns}
        request={params => getStudentList(params)}
        rowKey="key"
        pagination={{
          showSizeChanger: true,
        }}
        scroll={{
          x: columns.length * 120,
        }}
        dateFormatter="string"
        headerTitle=""
      />
    </PageHeaderWrapper>
  )
};

