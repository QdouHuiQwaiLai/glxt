import React from "react";
import {Chart,Geom,Axis,Tooltip,Coord,Label,Legend,} from "bizcharts";
import { Select } from 'antd'
import DataSet from "@antv/data-set";
import styled from '@emotion/styled'

import TreeSelected from './treeSelect'

import ExportButton from '../../../../components/exportButton'
import getConditionText from   '../../../../components/getConditionText'

const { Option } = Select

const conditionList = [
  {name: "gender", title: "性别"},
  {name: "flag", title: "报道"},
  {name: "line", title: "过重点线"},
  {name: "provolunteer", title: "专业志愿号"},
  {name: "branch", title: "科类"},
  {name: "plan", title: "计划"},
  {name: "language", title: "外语语种"},
  {name: "political", title: "政治面貌"},
  {name: "feature", title: "特征"},
]


export default (props) => {
  const { currentSchoolData, dispatch, fanData } = props
  const {  selectCondition, treeSelectData, data } = fanData
  const { DataView } = DataSet

  // 设置饼图数据
  const dv = new DataView()
  dv.source(data).transform({
    type: "percent",
    field: "count",
    dimension: "item",
    as: "percent"
  })
  const cols = {
    percent: {
      formatter: val => {
        val =  parseInt(val * 100) + "%";
        return val;
      }
    }
  }

  // 条件选择器改变
  const conditionChange = (value) => {
    dispatch({
      type: 'used/updateFanCondition',
      payload: { 
        selectCondition: value,
      },
    })
    dispatch({
      type: 'used/fanTreeSelectChange',
      payload: { 
        value: [],
        condition: {},
        scoreType: "",
        result: value
      },
    })
  }

  // 树选择器改变
  const treeSelectChange = (treeSelectData, conditionObj, scoreType, currentCondition) => {
    dispatch({
      type: 'used/fanTreeSelectChange',
      payload: { 
        value: treeSelectData,
        condition: conditionObj,
        scoreType: "",
        result: currentCondition
      },
    })
  }  

  // 数据导出
  const exportData = () => {
    const {name, title} = conditionList.find((condition) => {
      return condition.name === selectCondition
    })
    const aoa = [
      [`扇形图分析数据-各${title}人数统计`, null,],
      [`${currentSchoolData.name}-${currentSchoolData.year}年`, null],
      [`当前筛选条件: ${getConditionText(treeSelectData, currentSchoolData)}`, null],
      [title, '人数'],
    ]
    const merges = [
      {s: {r: 0, c: 0}, e: {r: 0, c: 4}},
      {s: {r: 1, c: 0}, e: {r: 1, c: 4}},
      {s: {r: 2, c: 0}, e: {r: 2, c: 4}},
    ]
    data.forEach(item => {
      aoa.push([item.item, item.count])
    })
    return {
      aoa: aoa,
      merges: merges,
    }
  }

  return (
    <FanWarp>
      <ExportButton 
        exportData={exportData}
        />
      <TitleWarp>
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
          {conditionList.map((condition) => <Option key={condition.name} value={condition.name}>{condition.title}</Option>)}
        </Select>
        { Object.keys(currentSchoolData).length == 0 ? null : 
            <TreeSelected
              currentSchoolData={currentSchoolData}
              treeSelectData={treeSelectData}
              currentCondition={selectCondition}
              treeSelectChange={treeSelectChange}/>
        }
        <span></span>
      </TitleWarp>
      <ChartWarp> 
        <Chart height={218}  padding={[8, -88, 8, 8]} data={dv} scale={cols} 
            forceFit
            >
            <Coord type="theta" radius={0.75} />
            <Axis name="percent" />
            <Legend
              position="left"
              offsetX={8}
              offsetY={- (10 - data.length) * 10}
            />
            <Tooltip
              showTitle={false}
              itemTpl="<li><span style=&quot;background-color:{color};&quot; class=&quot;g2-tooltip-marker&quot;></span>{name}: {value}</li>"
            />
            <Geom
              type="intervalStack"
              position="percent"
              color="item"
              tooltip={[
                "item*percent",
                (item, percent) => {
                  const currentItem = data.find(element => element.item === item)
                  return {
                    name: item,
                    value: currentItem.count,
                  };
                }
              ]}
              style={{
                lineWidth: 1,
                stroke: "#fff"
              }}
            >
              <Label
                content="percent"
                offset={-30}
                textStyle={{
                  rotate: 30,
                  textAlign: "center",
                  shadowBlur: 2,
                  shadowColor: "rgba(0, 0, 0, .45)"
                }}
              />
            </Geom>
          </Chart>
      </ChartWarp>
    </FanWarp>
  )
}

const FanWarp = styled.div`
  position: relative;
  grid-area: fan;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 50px auto;
  background: #fff;
  padding: 0px 16px;
  overflow: hidden;
  grid-template-areas: 
    "title"
    "chart"
`

const TitleWarp = styled.div`
  grid-area: title;
  display: grid;
  grid-template-rows: 50px;
  grid-gap: 8px 8px;
  grid-template-columns: 2fr 3fr 1fr;
  // line-height: 50px;
  font-weight: normal;
`

const ChartWarp = styled.div`
  grid-area: chart; 
  display: inline-block;
  grid-template-rows: 1fr;
  overflow: hidden;
`