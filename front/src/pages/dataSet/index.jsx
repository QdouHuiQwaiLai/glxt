import React , { useState,  useRef, useEffect } from 'react';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Upload, Divider, Input, Modal, notification } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Popconfirm, message } from 'antd';
import ProTable from '@ant-design/pro-table';
import objectIdToTimestamp from 'objectid-to-timestamp'
import { queryUploadList, getSchoolList, addSchoolName, deleteTaskFile, uploadTask, getTaskProgress, updateStudent } from './service';
import SelectSchool from './selectSchool'
import Demo from './tio'
import {  Space } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

export default () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [uploadList, setUploadList] = useState([])
  const [schoolList, setSchoolList] = useState([])
  const actionRef = useRef();

  useEffect(() => {
    let flag = false
    for(let i = 0; i < uploadList.length; i++) {
      if (uploadList[i].status === 0) {
        flag = true
        getTaskProgress({taskId: uploadList[i].taskId})
      }
    }
    
    if (flag) {
      window.setTimeout(() => {
        if (actionRef.current) {
          actionRef.current.reload();
        }
      }, 2000)
    }
  }, [uploadList]);


  const getUploadList = async params => {
    params.sid = params.school
    delete params.school
    const schoolData =  await getSchoolList()
    setSchoolList(schoolData.data)
    const uplpadData =  await queryUploadList(params)
    const uplpadDataList = parseUploadList(uplpadData, schoolData)
    setUploadList(uplpadDataList.data)
    return uplpadDataList
  }

  const parseUploadList = (uplpadData, schoolData) => {
    for(let i = 0; i < uplpadData.data.length; i++) {
      for (let j = 0; j < schoolData.data.length; j++) {
        if (uplpadData.data[i].sid === schoolData.data[j].id) {
          uplpadData.data[i].school = {}
          uplpadData.data[i].school.id = schoolData.data[j].id
          uplpadData.data[i].school.name = schoolData.data[j].name
        }
      }
    } 
    return uplpadData
  }

  const addSchoolNameHandle = async (name) => {
    const response = await addSchoolName({"name": name})
    if (response.code === 0) {
      notification.success({
        message: '增加成功',
      })
      if (actionRef.current) {
        actionRef.current.reload();
      }
    }
  }

  const deleteTaskHandle = async (sid, year, taskFile, status, flag) => {
    const deleteTask =  async (sid, year, taskFile, status, flag) => {
      const response = await deleteTaskFile({"sid": sid, "year": year, "taskFile": taskFile, "deleteYear": flag, "DeleteStudent": true})
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
      content: '删除会失去此次导入的所有学生信息',
      okText: '是',
      okType: 'danger',
      cancelText: '否',
      onOk() {
        deleteTask(sid, year, taskFile, status, flag)
      },
      onCancel() {

      },
    });
  }

  const showDetails = (status) => {
    Modal.info({
      title: '导入错误信息',
      icon: <ExclamationCircleOutlined />,
      content: status == 1 ? '无' : '导入文件格式有误',
      okText: '知道了',
    });
  }

  const addTask = async (params) => {
    const formData = new FormData();
    formData.append('id', params.school);
    formData.append('year', params.year);
    if(params.data.length < 2) {
      formData.append('school', null)
      formData.append('student', params.data[0])
    } else {
      formData.append('school', params.data[0])
      formData.append('student', params.data[1])
    }
    const response = await uploadTask(formData)
    setModalVisible(false);
    if (response.code === 0) {
      notification.success({
        message: '增加成功',
      })
      actionRef.current.reload();
    }
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
      title: '编号',
      dataIndex: 'taskFile',
      hideInForm: true,
      hideInSearch: true,
    },
    {
      title: '学校',
      dataIndex: 'school',
      valueType: 'text',
      renderText: (item,{value,onChange}) => item.name,
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        return (
        <SelectSchool 
        schoolList={schoolList}
        onChange={selectedName => {
          void (form.setFieldsValue({"school": selectedName}))}
        }
        addSchoolNameHandle= {
          name => addSchoolNameHandle(name)
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
      title: '状态',
      dataIndex: 'status',
      hideInForm: true,
      hideInSearch: true,
      valueEnum: {
        0: {
          text: '导入中',
          status: 'Processing',
        },
        1: {
          text: '导入成功',
          status: 'Success',
        },
        2: {
          text: '导入失败',
          status: 'Error',
        },
      },
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
          <a
            onClick={() => {
              showDetails(record.status);
            }}
          >
            详情
          </a>
          <Divider type="vertical" />
          <a 
            onClick={() => {
              deleteTaskHandle(record.sid, record.year, record.taskFile, record.status, false)
             }}
          >删除</a>
          <Divider type="vertical" />
          <a 
            onClick={() => {
              deleteTaskHandle(record.sid, record.year, record.taskFile, record.status, true)
             }}
          >同时删除年级</a>
        </>
      )},
    },
    {
      title: '数据',
      dataIndex: 'data',
      valueType: 'text',
      hideInTable: true,
      hideInSearch: true,
      rules: [
        {
          required: true,
          // message: '规则名称为必填项',
        },
      ],
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        return (<Demo
          setData={data => {
            void (form.setFieldsValue({"data": data}))}
          }
        ></Demo>)
      }
    },
  ];


  return (
    <PageHeaderWrapper title={false}>
      <ProTable
        actionRef={actionRef}
        columns={columns}
        request={params => getUploadList(params)}
        rowKey="key"
        pagination={{
          showSizeChanger: true,
        }}
        scroll={{
          x: columns.length * 120,
        }}
        dateFormatter="string"
        headerTitle=""
        toolBarRender={() => [
          <Button key="3" type="primary" onClick={() => void(setModalVisible(true))}>
            <PlusOutlined />
            新建导入
          </Button>,
        ]}
      />
        <Modal
          destroyOnClose
          title="新建导入"
          visible={modalVisible}
          onCancel={() => void(setModalVisible(false))}
          footer={null}
        >
            <ProTable
              style={{
                maxWidth: 500,
              }}
              type="form"
              columns={columns}
              onSubmit={(params) => {
                // eslint-disable-next-line no-console
                addTask(params);
              }}
            />
        </Modal>
    
      
    </PageHeaderWrapper>
  )
};

