import { Select, Divider, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
const { Option } = Select;


export default (props) => {
  const [name, setName] = useState('')
  const { schoolList,onChange,  } = props
  return (
    <Select
        style={{ maxWidth: '100%' }}
        placeholder="请选择学校"
        onChange={selectedName => void (onChange(selectedName))}
      >
        {schoolList.map(item => (
          <Option key={item.id}>{item.name}</Option>
        ))}
      </Select>
  )
}