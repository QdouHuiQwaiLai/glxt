import React, { useState, useEffect } from 'react'
import { Select, Button } from 'antd'
import { getSchoolFirstYear } from '../util';

const { Option } = Select;


const TopSelect = (props) => {
  const { schoolList, dispatch, diffSchoolList, topSelectData, } = props
  const {selectSchool, selectYear } = topSelectData
  useEffect(() => {
    dispatch({
      type: 'used/topSelectChange',
      payload: { 
        "selectSchool": selectSchool,
        "selectYear": selectYear
      },
    })
  }, [])

  const handleProvinceChange = value => {
    dispatch({
      type: 'used/topSelectChange',
      payload: { 
        "selectSchool": value,
        "selectYear": getSchoolFirstYear(schoolList, value)
      },
    })
  }

  const onSecondCityChange = value => {
    dispatch({
      type: 'used/topSelectChange',
      payload: { 
        "selectSchool": selectSchool,
        "selectYear": parseInt(value)
      },
    })
  }
  
  return (
    <div style={{'gridArea': 'header', paddingLeft:'16px', background: '#fff', lineHeight: '50px'}}>
      <Select
        value={selectSchool}
        style={{ width: 140, marginRight:'16px' }}
        onChange={handleProvinceChange}
      >
        {schoolList.map(school => (
          <Option key={school.id}>{school.name}</Option>
        ))}
      </Select>
      <Select
        style={{ width: 120 }}
        value={selectYear}
        onChange={onSecondCityChange}
      >
        {diffSchoolList.map(school => {
          if (school.id == selectSchool) {
            return (<Option key={parseInt(school.year)}>{school.year}</Option>)
          }
        })}
      </Select>
    </div>
  )
}

export default  TopSelect
