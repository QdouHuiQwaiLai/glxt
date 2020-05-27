import React , { useState, useEffect } from 'react';
import {  Upload, Divider,  Modal } from 'antd';
import { Row, Col } from 'antd';
import { Form, Input, Button, Checkbox, List, Spin, Typography } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Link, connect } from 'umi'
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import _ from 'lodash'

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 8 },
};


const People = props => {
  const { people = {}, submitting } = props;
  const { dispatch } = props;
  const { peopleList, status } = people;
  const [form] = Form.useForm();
  const [, forceUpdate] = useState();

  useEffect(() => {
    forceUpdate({});
    dispatch({
      type: 'people/getPeopleList',
      payload: { },
    });
  }, [])

  const onFinish = values => {
    dispatch({
      type: 'people/parentCreate',
      payload: { username: values.childUser,  password: values.childPwd},
    });
  }

  const deleteUser = id => {
    dispatch({
      type: 'people/deleteUser',
      payload: { id: id},
    })
  }

  return (
    <PageHeaderWrapper title={false}>
      <Row>
        <Col span={24} style={{background: "#fff", padding: "24px"}}>
          <Form
          {...layout}
          form={form} name="horizontal_login" layout="inline" onFinish={onFinish}>
            <Form.Item
              name="childUser"
              rules={[{ required: true, message: '输入要开通的账号' }]}
            >
              <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="ChildUser" />
            </Form.Item>
            <Form.Item
              name="childPwd"
              rules={[{ required: true, message: '输入密码' }]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="ChildPwd"
              />
            </Form.Item>
            <Form.Item shouldUpdate={true}>
              {() => (
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={submitting}
                  disabled={
                    !form.isFieldsTouched(true) ||
                    form.getFieldsError().filter(({ errors }) => errors.length).length
                  }
                >
                  增加
                </Button>
              )}
            </Form.Item>
          </Form>
        </Col>

        <Col span={24} style={{background: "#fff", marginTop: "24px", padding: "24px"}}>
          <List
            style={{minHeight: "57px"}}
            bordered
            dataSource={peopleList}
            renderItem={people => (
              <List.Item>
                <Col style={{display: "inline-block"}} span={22}>
                账号:  {people.username}
                </Col>
                <Col style={{display: "inline-block"}} span={2} 
                >
                <Button
                  onClick={() => deleteUser(people.id)}
                  type="primary"
                  htmlType="submit"
                >
                  删除
                </Button>
                </Col>
              </List.Item>
            )}
          >
            {!status? <Spin /> : null}
          </List>
        </Col>
      </Row>
     
    </PageHeaderWrapper>
  )
};

export default connect(({ people, loading }) => ({
  people: people,
  submitting: loading.effects['people/parentCreate'],
}))(People);


