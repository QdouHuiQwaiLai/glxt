import { Select, Divider, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
const { Option } = Select;


export default (props) => {
  const [name, setName] = useState('')
  const { list,onChange,   } = props
  return (
    <Select
        style={{ maxWidth: '100%' }}
        placeholder="请选择"
        onChange={selectedName => void (onChange(selectedName))}
      >
        {list.map((item, index) => (
          <Option key={index}>{item}</Option>
        ))}
      </Select>
  )
}