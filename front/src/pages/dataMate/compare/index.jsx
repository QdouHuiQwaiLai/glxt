import React , { useState, useEffect } from 'react'
import { Select } from 'antd'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import { Link, connect } from 'umi'
import {  Chart, Geom, Axis, Tooltip,} from 'bizcharts'
import DataSet from '@antv/data-set'
import Slider from 'bizcharts-plugin-slider'
import styled from '@emotion/styled'

import SelectItem from './components/selectItem'
import ExportButton from '../../../components/exportButton'
import getConditionText from   '../../../components/getConditionText'

const cols = {
  sales: {
    tickInterval: 20,
  },
}

const Compare = (props) => {
  const { compare = {}, dispatch, loding } = props
  const { schoolList, diffSchoolList, itemList  } = compare;

  useEffect(() => {
    if (schoolList.length == 0 ) {
      dispatch({
        type: 'compare/getSchoolList',
        payload: { },
      })
    }
  }, [])

  // 增加对比项目
  const onAddItem = () => {
    dispatch({
      type: 'compare/addItem',
      payload: { },
    })
  }

  const handleSliderChange = e => {
    const { startRadio, endRadio } = e;
    ds.setState('start', startRadio);
    ds.setState('end', endRadio);
  }

  // 设置数据 start
  const data = itemList.map((item, index) => {
    return {
      id: `item-${index}`,
      count: item.count
    }
  }) 
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
  })
  // 设置数据 end

  // 数据导出
  const exportData = () => {
    const aoa = [
      ['对比分析数据', null, null, null],
      ['对比项学校-年份', '筛选条件', '人数'],
    ] 
    const merges = [
      {s: {r: 0, c: 0}, e: {r: 0, c: 4}},
    ]
    itemList.forEach(item => {
      aoa.push([
        `${item.currentSchoolData.name}-${item.currentSchoolData.year}年`, 
        getConditionText(item.treeSelectData, item.currentSchoolData),
       item.count,
      ])
    })
    return {
      aoa: aoa,
      merges: merges,
    }
  }
  

  return (
    <PageHeaderWrapper title={false}>
      <ItemWarp>
      {diffSchoolList.length === 0 ? null :
        itemList.map((item, index) => <SelectItem
          key={index}
          currentIndex={index}
          diffSchoolList={diffSchoolList}
          itemData={item}
          dispatch={dispatch}
        />) 
      }
        <AddItem
          onClick={onAddItem}
        >+ 新增对比项目</AddItem>
      </ItemWarp>
      <CharWarp>
        <Chart 
        style={{
          position: "relative",
        }}
        height={400} padding='auto' data={dv} scale={cols} forceFit>
          <ExportButton 
            exportData={exportData}
          />
          <Axis name="id" />
          <Axis name="count" />
          <Tooltip
            crosshairs={{
              type: 'y',
            }}
          />
          <Geom type="interval" position="id*count" />
        </Chart>
        <Slider
          data={data}
          padding={32}
          textStyle={{'display': 'none', fontSize: 0}}
          xAxis="id"
          yAxis="count"
          onChange={handleSliderChange}
        />
      </CharWarp>
    </PageHeaderWrapper>
  )
}

export default connect(({ compare, loading }) => ({
  compare: compare,
  loding: loading.effects['compare/analItemData'],  // 数据加载状态
}))(Compare)

const ItemWarp = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`


const AddItem = styled.div`
  display: flex;
  justify-content: space-between;
  line-height: 34px;
  height: 50px;
  width: 48%;
  padding: 8px;
  // margin-right: 8px;
  margin-bottom: 16px;
  background: #fff;
  border: 1px #d9d9d9 dashed;
  cursor: pointer;
`

const CharWarp = styled.div`
  background: #fff;
  width: 100%;
  padding: 24px;
`


