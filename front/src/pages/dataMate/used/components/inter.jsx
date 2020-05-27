import React , { useState, useEffect } from 'react';
import { Button, Upload, Divider, Input, Modal, Select } from 'antd';
import {Chart,Geom,Axis,Tooltip,} from 'bizcharts';
import DataSet from '@antv/data-set';
import Slider from 'bizcharts-plugin-slider';
import styled from '@emotion/styled'

import TreeSelected from './treeSelect'

import ExportButton from '../../../../components/exportButton'
import getConditionText from   '../../../../components/getConditionText'

const { Option } = Select

const cols = {
  sales: {
    tickInterval: 20,
  },
}

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
  {name: "profession", title: "专业"},
]

const scoreList = [
  {name: "score", title: "高考成绩"},
  {name: "feascore", title: "特征成绩"},
  {name: "mathsocre", title: "数学成绩"},
  {name: "foreignscore", title: "外语成绩"},
]


export default (props) => {
  const { currentSchoolData, dispatch, interData } = props
  const { data, treeSelectData, selectCondition, selectScore  } = interData

  // 设置数据
  const ds = new DataSet({
    state: {
      start: 0,
      end: 1,
    },
  })
  const dv = ds.createView('origin').source(data)
  dv.transform({
    type: 'filter',
    callback(item, idx) {
      const radio = idx / data.length;
      return radio >= ds.state.start && radio <= ds.state.end;
    },
  }) // 设置数据end

  // 分数选择器
  const scoreChange = (value) => {
    dispatch({
      type: 'used/interScoreSelectChange',
      payload: { 
        selectScore: value,
      },
    })
  }

  // 条件选择器改变
  const conditionChange = (value) => {
    dispatch({
      type: 'used/updateInterCondition',
      payload: { 
        selectCondition: value,
      },
    })
    dispatch({
      type: 'used/interTreeSelectChange',
      payload: { 
        value: [],
        condition: {},
        scoreType: selectScore,
        result: value
      },
    })
  }

  // 树选择器改变
  const treeSelectChange = (treeSelectData, conditionObj, scoreType, currentCondition) => {
    dispatch({
      type: 'used/interTreeSelectChange',
      payload: { 
        value: treeSelectData,
        condition: conditionObj,
        scoreType: scoreType,
        result: currentCondition
      },
    })
  } 

  // 滑动条事件
  const handleSliderChange = e => {
    const { startRadio, endRadio } = e;
    ds.setState('start', startRadio);
    ds.setState('end', endRadio);
  }

  // 数据导出
  const exportData = () => {
    const {name, title} = conditionList.find((condition) => {
      return condition.name === selectCondition
    })
    const selectScoreText = scoreList.find((score) => {
      return score.name === selectScore
    }).title
    // console.log(data, treeSelectData, selectCondition, selectScore)
    const aoa = [
      [`区间柱状图分析数据-各${title}人数成绩统计`, null,],
      [`${currentSchoolData.name}-${currentSchoolData.year}年`, null],
      [`当前筛选条件: ${getConditionText(treeSelectData, currentSchoolData)}`, null],
      [`当前分析分数类型: ${selectScoreText}`, null],
      [title, '人数', '最高分', '最低分', '平均数', '中位数'],
    ]
    const merges = [
      {s: {r: 0, c: 0}, e: {r: 0, c: 4}},
      {s: {r: 1, c: 0}, e: {r: 1, c: 4}},
      {s: {r: 2, c: 0}, e: {r: 2, c: 4}},
      {s: {r: 3, c: 0}, e: {r: 3, c: 4}},
    ]
    data.forEach(item => {
      aoa.push([item.x, item.count, item.y[1], item.y[0], item.avgScore, item.midScore])
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
          <Select 
              value={selectScore} 
              style={{  
                boxSizing: "border-box",
                marginTop: "9px",
                width: '100%',
                height: "34px",
                fontWeight: 'normal',
              }} 
              onChange={scoreChange}
            >
              {scoreList.map((score) => <Option key={score.name} value={score.name}>{score.title}</Option>)}
            </Select>
          { Object.keys(currentSchoolData).length == 0 ? null : 
            <TreeSelected
              currentSchoolData={currentSchoolData}
              treeSelectData={treeSelectData}
              currentCondition={selectCondition}
              currentScore={selectScore}
              treeSelectChange={treeSelectChange}/>
          }
        </TitleWarp>
        <ChartWarp> 
          <Chart height={172}  padding='auto' data={dv} scale={cols} 
          forceFit
          >
            <Axis name="x" />
            <Axis name="y" />
             <Tooltip 
              crosshairs={{
                type: 'y',
              }}
              />
            <Geom type="interval"
             position="x*y" 
             tooltip={['x*y', (x, y) => {
              return {
                name: `人数: ${data.find(item=>item.x ===x).count}<br>
                <svg viewBox="0 0 5 5" class="g2-tooltip-marker" style="width: 5px; height: 5px; border-radius: unset; display: inline-block; margin-right: 8px;"><path d="M2.5,2.5m-2.5,0a2.5,2.5,0,1,0,5,0a2.5,2.5,0,1,0,-5,0" fill="#1890FF" stroke="none"></path></svg> 平均值:${data.find(item=>item.x ===x).avgScore}<br>
                <svg viewBox="0 0 5 5" class="g2-tooltip-marker" style="width: 5px; height: 5px; border-radius: unset; display: inline-block; margin-right: 8px;"><path d="M2.5,2.5m-2.5,0a2.5,2.5,0,1,0,5,0a2.5,2.5,0,1,0,-5,0" fill="#1890FF" stroke="none"></path></svg> 最大值:${y[1]}<br>
                <svg viewBox="0 0 5 5" class="g2-tooltip-marker" style="width: 5px; height: 5px; border-radius: unset; display: inline-block; margin-right: 8px;"><path d="M2.5,2.5m-2.5,0a2.5,2.5,0,1,0,5,0a2.5,2.5,0,1,0,-5,0" fill="#1890FF" stroke="none"></path></svg> 最小值:${y[0]}<br>
                <svg viewBox="0 0 5 5" class="g2-tooltip-marker" style="width: 5px; height: 5px; border-radius: unset; display: inline-block; margin-right: 8px;"><path d="M2.5,2.5m-2.5,0a2.5,2.5,0,1,0,5,0a2.5,2.5,0,1,0,-5,0" fill="#1890FF" stroke="none"></path></svg> 中位数:${data.find(item=>item.x ===x).midScore}`,
              };
            }]}
            />
          </Chart>
        </ChartWarp>
        <SliderWarp> 
        <Slider
          data={data}
          padding={8}
          textStyle={{'display': 'none', fontSize: 0}}
          xAxis="year"
          yAxis="sales"
          onChange={handleSliderChange}
        />
        </SliderWarp>
      </BarWarp>
  )
}

const BarWarp = styled.div`
  position: relative;
  grid-area: inter;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 50px auto 36px;
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
  grid-gap: 8px 8px;
  grid-template-columns: 1fr 2fr 3fr;
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