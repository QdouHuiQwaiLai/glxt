import React , { useState, useEffect } from 'react';
// import { Button, Upload, Divider, Input, Modal, Spin } from 'antd';
import { DownloadOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import {Chart,Geom,Axis,Tooltip,} from 'bizcharts'
import DataSet from '@antv/data-set'
import Slider from 'bizcharts-plugin-slider'
import styled from '@emotion/styled'

import TreeSelected from './treeSelect'

import ExportButton from '../../../../components/exportButton'
import getConditionText from   '../../../../components/getConditionText'

const cols = {
  sales: {
    tickInterval: 20,
  },
}

export default (props) => {
  const { currentSchoolData, dispatch, barData } = props
  const { data, currentData, treeSelectData, departmentId, title} = barData
  // 设置数据
  const ds = new DataSet({
    state: {
      start: 0,
      end: 1,
    },
  })
  const dv = ds.createView('origin').source(currentData)
  dv.transform({
    type: 'filter',
    callback(item, idx) {
      const radio = idx / currentData.length;
      return radio >= ds.state.start && radio <= ds.state.end;
    },
  }) // 设置数据end

  // 进度条事件
  const handleSliderChange = e => {
    const { startRadio, endRadio } = e
    ds.setState('start', startRadio)
    ds.setState('end', endRadio)
  }

  // 双击
  const handleDbClick = e => {
    if (departmentId === null){
      dispatch({
        type: 'used/updateBarCurrentData',
        payload: { 
          id: e.data._origin.id
         },
      })
    }
  }

  // 树选择器改变
  const treeSelectChange = (treeSelectData, conditionObj, scoreType, currentCondition) => {
    dispatch({
      type: 'used/barTreeSelectChange',
      payload: { 
        value: treeSelectData,
        condition: conditionObj,
        scoreType: "",
        result: currentCondition
      },
    })
  }  

  // 返回全校
  const backAll = e => {
    dispatch({
      type: 'used/updateBarDepartmentId',
      payload: {},
    })
  }

  // 数据导出
  const exportData = () => {
    const aoa = [
      ['柱状图分析数据-各专业人数统计', null,],
      [`${currentSchoolData.name}-${currentSchoolData.year}年`, null],
      [`当前筛选条件: ${getConditionText(treeSelectData, currentSchoolData)}`, null],
      ['专业', '人数'],
    ]
    const merges = [
      {s: {r: 0, c: 0}, e: {r: 0, c: 4}},
      {s: {r: 1, c: 0}, e: {r: 1, c: 4}},
      {s: {r: 2, c: 0}, e: {r: 2, c: 4}},
    ]
    let line = 4
    barData.data.forEach(item => {
      aoa.push([`${item.title}`, null])
      merges.push({s: {r: line, c: 0}, e: {r: line, c: 1}})
      line = line + 1
      item.children.forEach(children => {
        aoa.push([`${children.title}`,children.number])
        line = line + 1
      })
    })

    return {
      aoa: aoa,
      merges: merges,
    }
  }

  return (
      <BarWarp>
        <ExportButton 
          exportData={exportData}
        />
        <TitleWarp>
          {title}
          { departmentId=== null ? <span></span> : <BackAllSpan onClick={backAll}>返回全校</BackAllSpan>}
          { Object.keys(currentSchoolData).length == 0 ? null : 
            <TreeSelected
              currentSchoolData={currentSchoolData}
              treeSelectData={treeSelectData}
              treeSelectChange={treeSelectChange}
              currentCondition={'profession'}
            />
          }
        </TitleWarp>
        <ChartWarp> 
          <Chart height={370} padding='auto' data={dv} scale={cols} 
          forceFit
          onIntervalDblclick={handleDbClick}
          >
            
            <Axis name="title" />
            <Axis name="number" />
            <Tooltip
              crosshairs={{
                type: 'y',
              }}
            />
            <Geom type="interval" position="title*number" />
          </Chart>
        </ChartWarp>
        <SliderWarp> 
          <Slider
            data={data}
            padding={8}
            textStyle={{'display': 'none', fontSize: 0}}
            xAxis="title"
            yAxis="number"
            onChange={handleSliderChange}
          />
        </SliderWarp> 
      </BarWarp>
  )
}


const BarWarp = styled.div`
  position: relative;
  grid-area: bar;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 50px auto 30px;
  background: #fff;
  padding: 0px 16px;
  overflow: hidden;
  grid-template-areas: 
    "title"
    "chart"
    "slider"
`

const TitleWarp = styled.div`
  grid-area: title;
  display: grid;
  grid-template-rows: 50px;
  grid-template-columns: 2fr 1fr  3fr;
  line-height: 50px;
  font-weight: normal;
`

const ChartWarp = styled.div`
  grid-area: chart; 
  display: inline-block;
  grid-template-rows: 1fr;
  overflow: hidden;
`

const SliderWarp = styled.div`
  grid-area: slider; 
  display: inline-block;
  grid-template-rows: 1fr;
  overflow: hidden;
`

const BackAllSpan = styled.div`
  color: #1890ff;
  cursor: pointer;
`