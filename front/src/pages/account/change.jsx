import React , { useState } from 'react';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import {  Upload, Divider,  Modal } from 'antd';
import { Row, Col } from 'antd';
import { Form, Input, Button, Checkbox } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styled from '@emotion/styled'
import { Link, connect } from 'umi';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 8 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 8 },
};

const Change =  props => {
  const { change = {}, submitting } = props;
  const onFinish = values => {
    const { dispatch } = props;
    dispatch({
      type: 'change/change',
      payload: { ...values, },
    });
  }

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  }
  return (
    <PageHeaderWrapper title={false}>
      <Row>
        <Col span={24} style={{background: "#fff", paddingTop: "24px"}}>
          <Form
            {...layout}
            name="basic"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              label="原密码"
              name="password"
              rules={[{ required: true, message: '输入原密码' }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              label="新密码"
              name="newPwd"
              rules={[{ required: true, message: '输入新密码' }]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item 
            {...tailLayout}
            >
            <Button loading={submitting} type="primary" htmlType="submit">
            更改
            </Button>
          </Form.Item>
        </Form>
        </Col>
      </Row>
     
    </PageHeaderWrapper>
  )
}

export default connect(({ change, loading }) => ({
  change: change,
  submitting: loading.effects['change/change'],
}))(Change);
