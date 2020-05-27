import React , { useState, useEffect } from 'react';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Upload, Divider, Input, Modal, Spin } from 'antd';
import { Link, connect } from 'umi'
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styled from '@emotion/styled'

import TopSelect from './components/topSelect'
;
import Bar from './components/bar'
import Fan from './components/fan'
import Inter from './components/inter'
import Map from './components/map'
import Ring from './components/ring'


const Used = props => {
  const { used = {}, submitting, baring, faning, intering, maping, ringing } = props;
  const { dispatch } = props;
  const { schoolList, diffSchoolList , currentSchoolData, 
    topSelectData, barData, fanData, interData, mapData, ringData,  } = used;

  useEffect(() => {
    if (schoolList.length == 0 ) {
      dispatch({
        type: 'used/getSchoolList',
        payload: { },
      })
    }
  }, [])

  return (
    <PageHeaderWrapper title={false}>
      <UsedWapper>
        { schoolList.length == 0 ? <span></span> :  
          <TopSelect 
            schoolList={schoolList} 
            diffSchoolList={diffSchoolList}
            topSelectData={topSelectData}
            dispatch={dispatch}/>
        }
        <MianWapper>
          {/* bar start */}
          {baring ? <BarLoding><Spin/></BarLoding> : null}
          <Bar 
            currentSchoolData={currentSchoolData}
            dispatch={dispatch}
            barData={barData}
          />
          {/* bar end */}
          {/* fan start */}
          {faning ? <FanLoding><Spin/></FanLoding> : null}
          <Fan 
            currentSchoolData={currentSchoolData}
            dispatch={dispatch}
            fanData={fanData}
          />
          {/* fan end */}
          {/* inter start */}
          {intering ? <InterLoding><Spin/></InterLoding> : null}
          <Inter 
            currentSchoolData={currentSchoolData}
            dispatch={dispatch}
            interData={interData} 
          />
          {/* inter end */}
          {/* map start */}
          {maping ? <MapLoding><Spin/></MapLoding> : null}
          <Map 
            currentSchoolData={currentSchoolData}
            dispatch={dispatch}
            mapData={mapData} 
          />
          {/* map end */}
          {/* ring start */}
          {ringing ? <RingLoding><Spin/></RingLoding> : null}
          <Ring 
            currentSchoolData={currentSchoolData}
            dispatch={dispatch}
            ringData={ringData}
          />
          {/* ring end */}
        </MianWapper>
      </UsedWapper>
    </PageHeaderWrapper>
  )
}

export default connect(({ used, loading }) => ({
  used: used,
  submitting: loading.effects['used/getSchoolList'],
  baring: loading.effects['used/analBarData'], // bar加载状态
  faning: loading.effects['used/analFanData'],  // fan 加载状态
  intering: loading.effects['used/analInterData'],  // fan 加载状态
  maping: loading.effects['used/analMapData'],  // map 加载状态
  ringing: loading.effects['used/analRingData'],  // ring 加载状态
}))(Used)


const UsedWapper = styled.div`
  display: grid;
  height: auto;
  grid-template-columns: 1fr;
  grid-template-rows: 50px auto;
  grid-gap: 24px 0;
  grid-template-areas: 
    "header"
    "main"
`

const MianWapper = styled.div`
  display: grid;
  grid-area: main;
  grid-template-columns: 5fr 3fr;
  grid-gap: 16px 16px;
  grid-template-rows: repeat(9, 1fr);
  height: 840px; 
  grid-template-areas: 
    "bar ring"
    "bar ring"
    "bar ring"
    "bar fan"
    "bar fan"
    "map fan"
    "map inter"
    "map inter"
    "map inter"
`

const BarLoding = styled.div`
  grid-area: bar;
  z-index: 1055;
  display: grid;
  text-align: center;
  background: #fff;
  padding: 0px 16px;
  padding-top: 200px;
  background: rgba(0, 0, 0, 0.03);
  transition: opacity 0.3s;
  overflow: hidden;
`

const FanLoding = styled.div`
  grid-area: fan;
  z-index: 1055;
  display: grid;
  text-align: center;
  background: #fff;
  padding: 0px 16px;
  padding-top: 150px;
  background: rgba(0, 0, 0, 0.03);
  transition: opacity 0.3s;
  overflow: hidden;
`

const InterLoding = styled.div`
  grid-area: inter;
  z-index: 1055;
  display: grid;
  text-align: center;
  background: #fff;
  padding: 0px 16px;
  padding-top: 150px;
  background: rgba(0, 0, 0, 0.03);
  transition: opacity 0.3s;
  overflow: hidden;
`

const MapLoding = styled.div`
  grid-area: map;
  z-index: 1055;
  display: grid;
  text-align: center;
  background: #fff;
  padding: 0px 16px;
  padding-top: 150px;
  background: rgba(0, 0, 0, 0.03);
  transition: opacity 0.3s;
  overflow: hidden;
`

const RingLoding = styled.div`
  grid-area: ring;
  z-index: 1055;
  display: grid;
  text-align: center;
  background: #fff;
  padding: 0px 16px;
  padding-top: 150px;
  background: rgba(0, 0, 0, 0.03);
  transition: opacity 0.3s;
  overflow: hidden;
`