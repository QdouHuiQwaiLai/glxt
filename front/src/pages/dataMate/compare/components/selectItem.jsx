import React, { useState, useEffect } from 'react'
import { Select, Button, Tag } from 'antd'
import styled from '@emotion/styled'

import SchoolSelect from './schoolSelect'
import TreeSelect  from './treeSelect'


export default (props) => {
  const { diffSchoolList, currentIndex, itemData, dispatch } = props
  const {  schoolId, year, currentSchoolData, treeSelectData, count } = itemData

  // 学校年份选择器改变
  const schoolSelectChange = (value) => {
    const [currentSchoolId, currentYear] = value.split('-')
    dispatch({
      type: 'compare/schoolSelectChange',
      payload: { 
        index: currentIndex,
        schoolId: currentSchoolId,
        year: parseInt(currentYear),
      },
    })
  }

  // 树选择器改变
  const treeSelectChange = (treeSelectData, conditionObj, scoreType, currentCondition) => {
    dispatch({
      type: 'compare/treeSelectChange',
      payload: { 
        index: currentIndex,
        value: treeSelectData,
        condition: conditionObj,
        scoreType: "",
        result: "null"
      },
    })
  }  

  // item关闭
  const itemClose = (e) => {
    dispatch({
      type: 'compare/updateDeleteItemList',
      payload: { 
        index: currentIndex,
      },
    })
  }



  return (
    <SelectItemWarp itemClose={itemClose}>
        <SchoolSelect 
          schoolId={schoolId}
          year={year}
          diffSchoolList={diffSchoolList}
          schoolSelectChange={schoolSelectChange}
        />
        <TreeSelect 
          currentSchoolData={currentSchoolData}
          treeSelectData={treeSelectData}
          treeSelectChange={treeSelectChange}
          currentCondition={''}
        />
    </SelectItemWarp>
  )
}


const SelectItemWarp = (props) => {
  return (
    <Tag 
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        width: "48%",
        padding: "8px",
        marginBottom: "16px",
        background: "#fff",
        marginRight: "0px",
      }}
      closable 
      onClose={props.itemClose}
      >
      {props.children }
    </Tag>)
}