import React, {useEffect} from "react";
import { Select, Table } from 'antd'
import styled from '@emotion/styled'
import provinceList from '../../../../components/province'

const { Option } = Select


export default (props) => {
  const {currentSchoolData, selectMold, selectCondition, conditionChange } = props

  useEffect(() => {
    conditionChange(selectCondition)
  }, [])

  return (
    <>
    {
      selectMold === "profession" ? 
      <Select 
        value={selectCondition} 
        style={{  
          boxSizing: "border-box",
          marginTop: "9px",
          width: '100%',
          height: "34px",
          fontWeight: 'normal',
        }} 
        onChange={conditionChange}
      >
        {Object.keys(currentSchoolData).length == 0 ? null: currentSchoolData.profession.map((item, index) => <Option key={index} value={index}>{item.name}</Option>)}
      </Select>
      : 
      <Select 
        value={selectCondition} 
        style={{  
          boxSizing: "border-box",
          marginTop: "9px",
          width: '100%',
          height: "34px",
          fontWeight: 'normal',
        }} 
        onChange={conditionChange}
      >
        {Object.keys(currentSchoolData).length == 0 ? null: provinceList.map((item, index) => <Option key={index} value={index}>{item.name}</Option>)}
      </Select>
    }
    </>
    )
}