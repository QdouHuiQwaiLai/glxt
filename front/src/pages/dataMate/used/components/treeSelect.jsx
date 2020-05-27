import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import provinceList from '../../../../components/province'
import { TreeSelect } from 'antd';

const { SHOW_PARENT } = TreeSelect;

const currentSchoolDataKeyName = {
  "branch": "科类",
  "plan": "计划",
  "language": "外语语种",
  "political": "政治面貌",
  "feature": "特征",
  "department": "学院",
}

const parseCurrentSchoolData = (currentSchoolData, currentCondition) => {
  const tree = [
    {
      title: '性别',
      value: 'gender',
      key: 'gender',
      children: [
        {
          title: '男',
          value: 'gender-1',
          key: 'gender-1',
        },
        {
          title: '女',
          value: 'gender-2',
          key: 'gender-2',
        }
      ]
    },
    {
      title: '报道',
      value: 'flag',
      key: 'flag',
      children: [
        {
          title: '是',
          value: 'flag-true',
          key: 'flag-true',
        },
        {
          title: '否',
          value: 'flag-flase',
          key: 'flag-flase',
        }
      ]
    },
    {
      title: '过重点线',
      value: 'line',
      key: 'line',
      children: [
        {
          title: '是',
          value: 'line-true',
          key: 'line-true',
        },
        {
          title: '否',
          value: 'line-flase',
          key: 'line-flase',
        }
      ]
    },
    {
      title: '专业志愿号',
      value: 'provolunteer',
      key: 'provolunteer',
      children: [
        {
          title: '0',
          value: 'provolunteer-0',
          key: 'provolunteer-0',
        },
        {
          title: '1',
          value: 'provolunteer-1',
          key: 'provolunteer-1',
        },
        {
          title: '2',
          value: 'provolunteer-2',
          key: 'provolunteer-2',
        },
        {
          title: '3',
          value: 'provolunteer-3',
          key: 'provolunteer-3',
        },
        {
          title: '4',
          value: 'provolunteer-4',
          key: 'provolunteer-4',
        },
        {
          title: '5',
          value: 'provolunteer-5',
          key: 'provolunteer-5',
        },
        {
          title: '6',
          value: 'provolunteer-6',
          key: 'provolunteer-6',
        },
        {
          title: 'z',
          value: 'provolunteer-z',
          key: 'provolunteer-z',
        },
      ]
    },
  ]
  // 插入省份
  const provinceObj = {
    title: '省份',
    value: 'province',
    key: 'province',
    children: [
    ]
  }
  provinceList.forEach((ele, i) => {
    provinceObj.children.push({
      title: ele.name,
      value: `province-${i}`,
      key: `province-${i}`,
    })
  })
  tree.push(provinceObj)
  // 插入
  Object.keys(currentSchoolData).forEach(key => {
    if (key === "scheme") return  // 不插入录取信息
    // 插入学院以外的
    if(Array.isArray(currentSchoolData[key]) && key !== 'profession'){
      const obj = {
        title: currentSchoolDataKeyName[key],
        value: key,
        key: key,
        children: [],
      }
      currentSchoolData[key].forEach((ele, i) => { 
        const childrenObj = {
          title: ele,
          value: `${key}-${i}`,
          key: `${key}-${i}`,
          children: [],
        }
        if (key === 'department') {
          // 向学院中插入专业数据
          currentSchoolData['profession'].forEach((professionEle, professionIndex) => {
            if (professionEle.parent === i) {
              childrenObj.children.push({
                title: professionEle.name,
                value: `profession-${professionIndex}`,
                key: `profession-${professionIndex}`,
              })
            }  
          })
        }
        obj.children.push(childrenObj)  // 插入到节点
      })
      tree.push(obj)  // 插入到树中
    }
  })
  // 删除当前条件
  const newTree = tree.filter((ele) => {
    if (currentCondition === 'profession') {
      return ele.key !== 'department'
    }
    return ele.key !== currentCondition
  })
  return newTree
}


const parseCondition = (condition, currentSchoolData) => {
  const conditionObj = {
    gender : [],
    flag : [],
    line : [],
    province : [],
    branch : [],
    plan : [],
    language : [],
    political : [],
    feature : [],
    profession : [],
    provolunteer: []
  }
  condition.forEach((ele) => {
    // 全选等于不选
    if (Object.keys(conditionObj).indexOf(ele) !== -1) {
      delete conditionObj[ele]
      return true
    }
    // 添加最底层的选择条件
    const [name, value] = ele.split('-')
    if (name === 'provolunteer') {  // 专业志愿号不用转换成数字
      conditionObj[name].push(value)
    } else {
      if (conditionObj[name]) {
        if (parseInt(value) || parseInt(value) === 0) {
          conditionObj[name].push(parseInt(value))
        } else {
          if (value === 'true') {
            conditionObj[name].push(true)
          } else {
            conditionObj[name].push(false)
          }
        } 
      }
    }

    // 添加学院
    if (name === 'department') {
      currentSchoolData['profession'].forEach((professionEle, professionIndex) => {
        if (professionEle.parent === parseInt(value)) {
          conditionObj['profession'].push(professionIndex)
        }  
      })
    }
  })
  // 删除空
  Object.keys(conditionObj).forEach(key => {
    if(conditionObj[key].length === 0) {
      delete conditionObj[key]
    }
  })
  return conditionObj
}

const TreeSelected = (props) => {
  const {currentSchoolData, currentCondition, treeSelectData, currentScore="", treeSelectChange} = props

  useEffect(() => {
    const conditionObj = parseCondition(treeSelectData, currentSchoolData)
    treeSelectChange(treeSelectData, conditionObj, currentScore, currentCondition)
  }, [])

  const onChange = value => {
    const conditionObj = parseCondition(value, currentSchoolData)
    treeSelectChange(value, conditionObj, currentScore, currentCondition)
  }

  const tProps = {
    treeData: parseCurrentSchoolData(currentSchoolData, currentCondition),
    value: treeSelectData,
    onChange: onChange,
    maxTagCount: 2,
    treeCheckable: true,
    showCheckedStrategy: SHOW_PARENT,
    placeholder: '选择筛选条件',
    style: {
      marginTop: "9px",
      width: '100%',
      fontWeight: 'normal',
    },
  }

  return <TreeSelect {...tProps} />
}

export default TreeSelected