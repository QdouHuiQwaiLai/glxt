import { Select, Divider, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
const { Option } = Select;


export default (props) => {
  const [name, setName] = useState('')
  const { schoolList,onChange, addSchoolNameHandle  } = props
  return (
    <Select
        style={{ maxWidth: '100%' }}
        placeholder="请选择学校"
        onChange={selectedName => void (onChange(selectedName))}
        dropdownRender={menu => (
          <div>
            {menu}
            <Divider style={{ margin: '4px 0' }} />
            <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
              <Input style={{ flex: 'auto' }} value={name} 
                onChange={event => void (setName(event.target.value))} 
              />
              <a
                style={{ flex: 'none', padding: '8px', display: 'block', cursor: 'pointer' }}
                // onClick={() => void ((setItems([...items, name])),(setName('')))}
                onClick= { () => {
                  addSchoolNameHandle(name)
                  setName('')
                }}
              >
                <PlusOutlined /> 增加学校
              </a>
            </div>
          </div>
        )}
      >
        {schoolList.map(item => (
          <Option key={item.id}>{item.name}</Option>
        ))}
      </Select>
  )
}