import React, {useEffect} from "react";
import { Select, Table } from 'antd'
import styled from '@emotion/styled'
import ConditionSelect from './ringCoditionSelect'
import ExportButton from '../../../../components/exportButton'
import provinceList from '../../../../components/province'

const { Option } = Select

const conditionList = [
  {name: "profession", title: "分专业"},
  {name: "province", title: "分省"},
]

const professionColumns = [
  {
    title: '省市',
    width: 50,
    dataIndex: 'province',
    key: 'province',
    fixed: 'left',
  },
  {
    title: '科类',
    width: 60,
    dataIndex: 'branch',
    key: 'branch',
  },
  {
    title: '计划',
    dataIndex: 'num',
    key: 'num',
    width: 50,
  },
  {
    title: '实录取',
    dataIndex: 'actualNum',
    key: 'actualNum',
    width: 60,
  },
  {
    title: '一本线',
    dataIndex: 'line',
    key: 'line',
    width: 60,
  },
  {
    title: '最高分',
    dataIndex: 'maxScore',
    key: 'maxScore',
    width: 60,
  },
  {
    title: '最低分',
    dataIndex: 'minScore',
    key: 'minScore',
    width: 60,
  },
  {
    title: '平均分',
    dataIndex: 'avgScore',
    key: 'avgScore',
    width: 60,
  },
  {
    title: '中位数',
    dataIndex: 'midScore',
    key: 'midScore',
    width: 60,
  },
  {
    title: '填报人数',
    dataIndex: 'fullNum',
    key: 'fullNum',
    width: 80,
  },
  {
    title: '填报率',
    dataIndex: 'fullPercent',
    key: 'fullPercent',
    width: 80,
  },
  {
    title: '一志愿录取数',
    dataIndex: 'firstNum',
    key: 'firstNum',
    width: 100,
  },
  {
    title: '一志愿录取率',
    dataIndex: 'firstPercent',
    key: 'firstPercent',
    width: 100,
  },
  {
    title: '调剂数',
    dataIndex: 'lastNum',
    key: 'lastNum',
    width: 80,
  },
  {
    title: '调剂率',
    dataIndex: 'lastPercent',
    key: 'lastPercent',
    width: 80,
  },
  {
    title: '重点数',
    dataIndex: 'lineNum',
    key: 'lineNum',
    width: 80,
  },
  {
    title: '重点率',
    dataIndex: 'linePercent',
    key: 'linePercent',
    width: 80,
  },
  {
    title: '报道数',
    dataIndex: 'flagNum',
    key: 'flagNum',
    width: 80,
  },
  {
    title: '报道率',
    dataIndex: 'flagPercent',
    key: 'flagPercent',
    width: 80,
  },
]

const provinceColumns = [
  {
    title: '专业',
    width: 120,
    dataIndex: 'profession',
    key: 'profession',
    fixed: 'left',
  },
  {
    title: '科类',
    width: 60,
    dataIndex: 'branch',
    key: 'branch',
  },
  {
    title: '计划',
    dataIndex: 'num',
    key: 'num',
    width: 50,
  },
  {
    title: '实录取',
    dataIndex: 'actualNum',
    key: 'actualNum',
    width: 60,
  },
  {
    title: '一本线',
    dataIndex: 'line',
    key: 'line',
    width: 60,
  },
  {
    title: '最高分',
    dataIndex: 'maxScore',
    key: 'maxScore',
    width: 60,
  },
  {
    title: '最低分',
    dataIndex: 'minScore',
    key: 'minScore',
    width: 60,
  },
  {
    title: '平均分',
    dataIndex: 'avgScore',
    key: 'avgScore',
    width: 60,
  },
  {
    title: '中位数',
    dataIndex: 'midScore',
    key: 'midScore',
    width: 60,
  },
  {
    title: '填报人数',
    dataIndex: 'fullNum',
    key: 'fullNum',
    width: 80,
  },
  {
    title: '填报率',
    dataIndex: 'fullPercent',
    key: 'fullPercent',
    width: 80,
  },
  {
    title: '一志愿录取数',
    dataIndex: 'firstNum',
    key: 'firstNum',
    width: 100,
  },
  {
    title: '一志愿录取率',
    dataIndex: 'firstPercent',
    key: 'firstPercent',
    width: 100,
  },
  {
    title: '调剂数',
    dataIndex: 'lastNum',
    key: 'lastNum',
    width: 80,
  },
  {
    title: '调剂率',
    dataIndex: 'lastPercent',
    key: 'lastPercent',
    width: 80,
  },
  {
    title: '重点数',
    dataIndex: 'lineNum',
    key: 'lineNum',
    width: 80,
  },
  {
    title: '重点率',
    dataIndex: 'linePercent',
    key: 'linePercent',
    width: 80,
  },
  {
    title: '报道数',
    dataIndex: 'flagNum',
    key: 'flagNum',
    width: 80,
  },
  {
    title: '报道率',
    dataIndex: 'flagPercent',
    key: 'flagPercent',
    width: 80,
  },
]


export default (props) => {
  const { currentSchoolData, dispatch, ringData } = props
  const {  selectMold, selectCondition, data } = ringData
  
  // 模式选择器改变
  const moldChange = (value) => {
    dispatch({
      type: 'used/ringMoldChange',
      payload: { 
        selectMold: value,
      },
    })
    dispatch({
      type: 'used/ringConditionChange',
      payload: { 
        selectCondition: 0,
      },
    })
  }

  // 当前条件改变
  const conditionChange = (value) => {
    dispatch({
      type: 'used/ringConditionChange',
      payload: { 
        selectCondition: value,
      },
    })
  }

  // 数据导出
  const exportData = () => {
    const currentMoldText = selectMold === 'profession' ? '省份' : '专业'
    const currentMold = selectMold === 'profession' ? 'province' : 'profession'
    const selectMoldText = selectMold === 'profession' ? '专业' : '省份'
    const selectConditionText = selectMold === 'profession' ? 
          currentSchoolData['profession'][selectCondition]['name'] : provinceList[selectCondition]['name']
    const aoa = [
      [`录取表格数据-分${selectMoldText}展示`, null, null,],
      [`${currentSchoolData.name}-${currentSchoolData.year}年`, null],
      [`当前${selectMoldText}: ${selectConditionText}`, null, null,],
      [`${currentMoldText}`, '科类', '计划', '实录取', '一本线',
       '最高分','最低分', '平均分', '中位数', '填报人数', 
       '填报率', '一志愿录取数', '一志愿录取率','调剂数', '调剂率', 
       '重点数',  '重点率','报道数', '报道率',
    ]
    ]
    const merges = [
      {s: {r: 0, c: 0}, e: {r: 0, c: 13}},
      {s: {r: 1, c: 0}, e: {r: 1, c: 13}},
      {s: {r: 2, c: 0}, e: {r: 2, c: 13}},
    ]
    data.forEach(item => {
      aoa.push([
        item[currentMold],item['branch'],item['num'],item['actualNum'],item['line'],
        item['maxScore'],item['minScore'],item['avgScore'],item['midScore'],item['fullNum'],
        item['fullPercent'],item['firstNum'],item['firstPercent'],item['lastNum'],item['lastPercent'],
        item['lineNum'],item['linePercent'],item['flagNum'],item['flagPercent'],
      ])
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
          value={selectMold} 
          style={{  
            boxSizing: "border-box",
            marginTop: "9px",
            width: '100%',
            height: "34px",
            fontWeight: 'normal',
          }} 
          onChange={moldChange}
        >
          {conditionList.map((condition) => <Option key={condition.name} value={condition.name}>{condition.title}</Option>)}
        </Select>
        {Object.keys(currentSchoolData).length == 0 ? null: 
          <ConditionSelect 
            currentSchoolData={currentSchoolData}
            selectMold={selectMold}
            selectCondition={selectCondition}
            conditionChange={conditionChange}
          />}
        <span></span>
      </TitleWarp>
      <ChartWarp> 
        <Table columns={selectMold === "profession" ? professionColumns : provinceColumns} dataSource={data} 
          height={168}
          size="small"
          rowKey={(record, index) => `${index}`}
          pagination={ false }
          scroll={{ y: 168, x: '100%' }} />
      </ChartWarp>
    </FanWarp>
  )
}

const FanWarp = styled.div`
  position: relative;
  grid-area: ring;
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
  grid-template-columns: 2fr 3fr 2fr;
  // line-height: 50px;
  font-weight: normal;
`

const ChartWarp = styled.div`
  grid-area: chart; 
  display: block;
  grid-template-rows: 1fr;
  height: 216px;
  overflow: hidden;
`