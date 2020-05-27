import React, { useState, useEffect } from 'react'
import { Select, Button } from 'antd'
import styled from '@emotion/styled'

const { Option } = Select;


export default (props) => {
  const { diffSchoolList, schoolId, year, schoolSelectChange } = props

  return (
    <Select
      value={`${schoolId}-${year}`}
      style={{ width: "46%"}}
      onChange={schoolSelectChange}
    >
      {diffSchoolList.map(school => (
        <Option key={
          `${school.id}-${school.year}`
        }>{`${school.name}-${school.year}`}</Option>
      ))}
    </Select>
  )
}