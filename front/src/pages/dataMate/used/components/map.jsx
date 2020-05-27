import React , { useState, useEffect } from 'react'
import { Chart, Coord, Axis, Tooltip, Geom,Label, Legend, View } from 'bizcharts'
import DataSet from '@antv/data-set'
import styled from '@emotion/styled'
import TreeSelected from './treeSelect'

import ExportButton from '../../../../components/exportButton'
import getConditionText from   '../../../../components/getConditionText'



export default (props) => {
  const { currentSchoolData, dispatch, mapData } = props
  const { data, treeSelectData } = mapData

  // 数据导出
  const exportData = () => {
    const aoa = [
      ['地钻图分析数据-各省份人数统计', null,],
      [`${currentSchoolData.name}-${currentSchoolData.year}年`, null],
      [`当前筛选条件: ${getConditionText(treeSelectData, currentSchoolData)}`, null],
      ['省份', '人数'],
    ]
    const merges = [
      {s: {r: 0, c: 0}, e: {r: 0, c: 4}},
      {s: {r: 1, c: 0}, e: {r: 1, c: 4}},
      {s: {r: 2, c: 0}, e: {r: 2, c: 4}},
    ]
    data.features.forEach(item => {
      aoa.push([item.properties.name, item.properties.size])
    })
    return {
      aoa: aoa,
      merges: merges,
    }
  }

  
  // 设置数据start
  const ds = new DataSet();
  const dv = ds
    .createView('back')
    .source(data, {
      type: 'GeoJSON',
    })
    .transform({
      type: 'geo.projection',
      projection: 'geoMercator',
      as: ['x', 'y', 'centroidX', 'centroidY'],
    })
  const bgView = new DataSet.View().source(dv.rows);
  const scale = {
    x: { sync: true },
    y: { sync: true },
  }
  const sizes = bgView.rows.map(r=>Number(r.properties.size))
  const min = Math.min(...sizes)
  const max = Math.max(...sizes)
  const colors ='#075A84,#3978A4,#6497C0,#91B6D7,#C0D6EA,#F2F7F8'.split(',').reverse()
  const interval = (max - min)/colors.length  // 设置数据end

  // 树选择器改变
  const treeSelectChange = (treeSelectData, conditionObj, scoreType, currentCondition) => {
    dispatch({
      type: 'used/mapTreeSelectChange',
      payload: { 
        value: treeSelectData,
        condition: conditionObj,
        scoreType: "",
        result: currentCondition
      },
    })
  }  

  return (
    <MapWarp>
      <ExportButton 
          exportData={exportData}
        />
      <TitleWarp>
        省份
        <span></span>
        { Object.keys(currentSchoolData).length == 0 ? null : 
          <TreeSelected
            currentSchoolData={currentSchoolData}
            treeSelectData={treeSelectData}
            treeSelectChange={treeSelectChange}
            currentCondition={'province'}
          />
        }
      </TitleWarp>
      <ChartWarp>
         <Chart scale={scale} data={bgView} height={298} forceFit padding='auto'>
            <Coord reflect='y'/>
            <Tooltip title='name' />
            <Geom
              type="polygon"
              position="x*y"
              style={{
                fill: '#DDDDDD',
                stroke: '#b1b1b1',
                lineWidth: 0.5,
                fillOpacity: 0.85,
              }}
              color={['properties',p=>{
              const idx = (Number(p.size)-min)/interval;
              return colors[Math.floor(idx)||0];
              }]}
              tooltip={['name*properties', (t, p) => {
              return {
                //自定义 tooltip 上显示的 title 显示内容等。
                name: 'Size',
                title:t,
                value: p.size
              };
            }]}
            ><Label type='map' content='name' textStyle={{
              fill:"#666",
              fontWeight:400,
              stroke:'#fff'
            }} />
            </Geom>
          </Chart>
        </ChartWarp>
    </MapWarp>
  )
}


const MapWarp = styled.div`
  position: relative;
  grid-area: map;
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
  grid-template-columns: 2fr 1fr  3fr;
  line-height: 50px;
  font-weight: normal;
`

const ChartWarp = styled.div`
  grid-area: chart; 
  display: inline-block;
  padding-top: 16px;
  grid-template-rows: 1fr;
  overflow: hidden;
`
