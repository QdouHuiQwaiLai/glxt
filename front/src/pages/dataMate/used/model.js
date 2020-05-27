import { stringify } from 'querystring'
import { history } from 'umi'
import { getSchoolList, analStudentNumber, analStudentScheme } from './service'
import { diffSchoolList, getCurrentSchoolData } from './util'
import { notification } from 'antd'
import full from '../../../components/full'
import provinceList from '../../../components/province'
import getLine from '../../../components/line'



const Model = {
  namespace: 'used',
  state: {
    schoolList: [],  // 学校列表
    diffSchoolList: [],   // 解析散列后的学校列表
    topSelectData: {selectSchool: "", selectYear: 0},  // 顶部选择栏数据
    currentSchoolData: {},  // 当前学校当前年份的数据
    barData: { data: [], currentData: [], treeSelectData: [], departmentId: null, title: "全校"},   // bar的数据和他这个时候展示的数据
    fanData: { data: [], treeSelectData: [], selectCondition: "gender" },  // 扇形图的数据
    interData: { data: [], treeSelectData: [], selectCondition: "gender", selectScore: "score" },  // 区间图的数据
    mapData: { data:[], treeSelectData: []},  // 地图的数据
    ringData: { data: [], selectMold: "profession", selectCondition: 0 }, // 录取表的数据
  },
  effects: {
    // 获取学校数据列表请求
    *getSchoolList({ payload }, { call, put }) {
      const response = yield call(getSchoolList, );
      if (response.code === 0) {
        yield put({
          type: 'updateShcoolList',
          payload: response['data'],
        })
      }
    },
    // 更新当前学校数据仅仅是为了做到同步运行
    *updateCurrentSchoolDataeffect({ payload }, {  put,}) {
      yield put({
        type: 'updateCurrentSchoolData',
        payload: payload,
      })
    },
    // 顶部选择器修改
    *topSelectChange({ payload }, {  put, take, select }) {
      yield put({
        type: 'updateCurrentSchoolDataeffect',
        payload: payload,
      })
      // 更新fan
      const topSelectData =  yield select(state => state.used.topSelectData)
      if (topSelectData.selectSchool === payload.selectSchool && topSelectData.selectYear === payload.selectYear) {
        return
      }
      // 更新bar树选择器
      yield put({
        type: 'updatebarTreeSelectData',
        payload: {
          value: []
        },
      })
      yield take('updateCurrentSchoolDataeffect/@@end')
      // 更新bar数据
      yield put({
        type: 'analBarData',
        payload: { 
          sid: payload.selectSchool,
          year: payload.selectYear,
          condition: {},
          scoreType: "",
          result: "profession"
        },
      })
      // 更新fan 条件
      yield put({
        type: 'updateFanCondition',
        payload: { 
          selectCondition: "gender",
        },
      })
      // 更新 fan树选择器
      yield put({
        type: 'fanTreeSelectChange',
        payload: { 
          value: [],
          condition: {},
          scoreType: "",
          result: "gender"
        },
      })
      // 更新fan数据
      yield put({
        type: 'analFanData',
        payload: { 
          sid: payload.selectSchool,
          year: payload.selectYear,
          condition: {},
          scoreType: "",
          result: "gender"
        },
      })
      // const topSelectData =  yield select(state => state.used.topSelectData)
      // 更新inter 条件
      yield put({
        type: 'updateInterCondition',
        payload: { 
          selectCondition: "gender",
        },
      })
      // 更新inter 树选择器
      yield put({
        type: 'interTreeSelectChange',
        payload: { 
          value: [],
          condition: {},
          scoreType: "score",
          result: "gender"
        },
      })
      // 更新inter 分数类型
      yield put({
        type: 'updateInterScoreSelectData',
        payload: { 
          selectScore: "score",
        },
      })
      // 更新inter 树选择器
      // 更新inter数据
      yield put({
        type: 'analInterData',
        payload: { 
          sid: payload.selectSchool,
          year: payload.selectYear,
          condition: {},
          scoreType: "score",
          result: "gender"
        },
      })
      // 更新 map树选择器
      yield put({
        type: 'mapTreeSelectChange',
        payload: { 
          value: [],
          condition: {},
          scoreType: "",
          result: "province"
        },
      })
      // 更新map数据
      yield put({
        type: 'analMapData',
        payload: { 
          sid: payload.selectSchool,
          year: payload.selectYear,
          condition: {},
          scoreType: "",
          result: "province"
        },
      })
      // 更新ring 模式选择器
      yield put({
        type: 'ringMoldChange',
        payload: { 
          selectMold: "profession",
        },
      })
      // 更新ring 条件选择器
      yield put({
        type: 'ringConditionChange',
        payload: { 
          selectCondition: 0,
        },
      })  
    },
    // bar数据请求
    *analBarData({ payload }, { call, put }) {
      const response = yield call(analStudentNumber,payload );
      if (response.code === 0) {
       yield put({
          type: 'updateBarData',
          payload: response['data'],
        }); 
      }
    }, 
    // bar树选择器修改
    *barTreeSelectChange({ payload }, {  put,  select }) {
      yield put({
        type: 'updatebarTreeSelectData',
        payload: payload,
      })
      const currentSchoolData =  yield select(state => state.used.currentSchoolData)
      yield put({
        type: 'analBarData',
        payload: { 
          sid: currentSchoolData.id,
          year: currentSchoolData.year,
          condition: payload.condition,
          scoreType: "",
          result: payload.result
        },
      })
    },
    // bar返回全校
    *barBackAll({ payload }, {  put, }) {
      yield put({
        type: 'updateBarDepartmentId',
        payload: {},
      })
    },
    // fan数据请求
    *analFanData({ payload }, { call, put }) {
      const response = yield call(analStudentNumber,payload );
      if (response.code === 0) {
       yield put({
          type: 'updateFanData',
          payload: response['data'],
        }); 
      }
    }, 
    // fan树选择器修改
    *fanTreeSelectChange({ payload }, {  put, select }) {
      yield put({
        type: 'updateFanTreeSelectData',
        payload: payload,
      })
      const currentSchoolData =  yield select(state => state.used.currentSchoolData)
      yield put({
        type: 'analFanData',
        payload: { 
          sid: currentSchoolData.id,
          year: currentSchoolData.year,
          condition: payload.condition,
          scoreType: "",
          result: payload.result
        },
      })
    },
    // inter 数据请求
    *analInterData({ payload }, { call, put }) {
      const response = yield call(analStudentNumber,payload );
      if (response.code === 0) {
       yield put({
          type: 'updateInterData',
          payload: response['data'],
        }); 
      }
    }, 
    // inter树选择器修改
    *interTreeSelectChange({ payload }, {  put, select }) {
      yield put({
        type: 'updateInterTreeSelectData',
        payload: payload,
      })
      const currentSchoolData =  yield select(state => state.used.currentSchoolData)
      yield put({
        type: 'analInterData',
        payload: { 
          sid: currentSchoolData.id,
          year: currentSchoolData.year,
          condition: payload.condition,
          scoreType: payload.scoreType,
          result: payload.result
        },
      })
    },
    // inter scoretype选择器修改
    *interScoreSelectChange({ payload }, {  put, select }) {
      yield put({
        type: 'updateInterScoreSelectData',
        payload: { 
          selectScore: payload.selectScore,
        },
      })
      const currentSchoolData =  yield select(state => state.used.currentSchoolData)
      const interData =  yield select(state => state.used.interData)
      yield put({
        type: 'analInterData',
        payload: { 
          sid: currentSchoolData.id,
          year: currentSchoolData.year,
          condition: parseCondition(interData.treeSelectData, currentSchoolData),
          scoreType: interData.selectScore,
          result: interData.selectCondition
        },
      })
    },
    // map数据请求
    *analMapData({ payload }, { call, put }) {
      const response = yield call(analStudentNumber,payload );
      if (response.code === 0) {
       yield put({
          type: 'updateMapData',
          payload: response['data'],
        }); 
      }
    }, 
    // map树选择器修改
    *mapTreeSelectChange({ payload }, {  put, select }) {
      yield put({
        type: 'updateMapTreeSelectData',
        payload: payload,
      })
      const currentSchoolData =  yield select(state => state.used.currentSchoolData)
      yield put({
        type: 'analMapData',
        payload: { 
          sid: currentSchoolData.id,
          year: currentSchoolData.year,
          condition: payload.condition,
          scoreType: "",
          result: payload.result
        },
      })
    },
    *analRingData({ payload }, { call, put }) {
      // console.log(payload)
      const response = yield call(analStudentScheme,payload );
      // console.log(response)
      if (response.code === 0) {
       yield put({
          type: 'updateRingData',
          payload: response['data'],
        }); 
      }
    }, 
    // ring 模式选择器修改
    *ringMoldChange({ payload }, {  put, select }) {
      const ringData = yield select(state => state.used.ringData)
      yield put({
        type: 'updateRingMold',
        payload: payload,
      })
    },
    // ring 条件选择器修改
    *ringConditionChange({ payload }, {  put, select }) {
      yield put({
        type: 'updateRingCondition',
        payload: payload,
      })
      const currentSchoolData =  yield select(state => state.used.currentSchoolData)
      const ringData = yield select(state => state.used.ringData)
      const schemeCodition = currentSchoolData.scheme === null ? [] : currentSchoolData.scheme.filter(item => item[ringData.selectMold]=== payload.selectCondition)
      yield put({
        type: 'analRingData',
        payload: { 
          sid: currentSchoolData.id,
          year: currentSchoolData.year,
          conditionList: schemeCodition,
        },
      })
    },
  },
  reducers: {
    // 更新学校列表
    updateShcoolList(state, { payload}, ) {
      return {...state, schoolList: payload, 
        diffSchoolList:diffSchoolList(payload),  
        topSelectData: {
          selectSchool: payload.length === 0 ? 0 : payload[0].id,
          selectYear: payload.length === 0 ? 0 : payload[0].data[0].year
        }
      }
    },
    // 更新当前选择的学校数据
    updateCurrentSchoolData(state, { payload }) {
      return {...state, 
        topSelectData: {
          selectSchool: payload.selectSchool,
          selectYear:  payload.selectYear
        },
        currentSchoolData: getCurrentSchoolData(state.diffSchoolList, payload.selectSchool, payload.selectYear)}
    },
    // bar相关更新start
    // bar数据更新
    updateBarData(state, { payload }) {
      const barData = []
      // 解析数据
      state.currentSchoolData.department.forEach((ele, index) => {
        const departmentItem = {
          title: ele,
          id: index,
          number: 0,
          children: []
        }
        const professionIdList = []
        state.currentSchoolData.profession.forEach((ele2, index2) => {
          if (ele2.parent == index) {
            professionIdList.push(index2)
          }
        })
        payload.list.forEach(profession => {
          if (professionIdList.includes(profession.id)) {
            departmentItem.number = departmentItem.number + profession.count
            departmentItem.children.push({
              title: state.currentSchoolData.profession[profession.id].name,
              id: profession.id,
              number: profession.count,
            })
          }
        })
        barData.push(departmentItem)
      })
      if (state.barData.departmentId !== null) {
        const currentDepartment = barData.find(department => department.id === state.barData.departmentId)
        const children = currentDepartment.children
        const title = currentDepartment.title
        const id = currentDepartment.id
        return {...state, barData: { ...state.barData, data:barData, currentData: children, departmentId:id, title: title }}
      } 
      return {...state, barData: { ...state.barData, data:barData, currentData: barData, departmentId:null, title: '全校' }}
    },
    // bar展示数据更新
    updateBarCurrentData(state, { payload }) {
      const currentDepartment = state.barData.data.find(department => department.id === payload.id)
      const children = currentDepartment.children
      const title = currentDepartment.title
      const id = currentDepartment.id
      return {...state, barData: { ...state.barData, currentData: children, departmentId:id, title: title  }}
    },
    // bar选择树数据更新
    updatebarTreeSelectData(state, { payload }) {
      return {...state, barData: { ...state.barData, treeSelectData: payload.value }}
    },
    // bar展开数据更新
    updateBarDepartmentId(state, { payload }) { 
      return {...state, barData: { ...state.barData, currentData: state.barData.data, departmentId:null, title: '全校' }}
    },
    // bar相关更新 end
    // fan相关更新 start
    // 更新fan的data
    updateFanData(state, { payload }) {
      const data = []
      if (payload.result === "gender") {
        payload.list.forEach(item => {
          data.push({
            item: item.id === 1 ? "男" : "女",
            count: item.count,
          })
        })
      } else if(payload.result === "flag" || payload.result === "line") {
        payload.list.forEach(item => {
          data.push({
            item: item.id ? "是" : "否",
            count: item.count,
          })
        })
      } else if(payload.result === "provolunteer") {
        payload.list.forEach(item => {
          data.push({
            item: item.id,
            count: item.count,
          })
        })
      } else {
        payload.list.forEach(item => {
          data.push({
            item: state.currentSchoolData[payload.result][item.id],
            count: item.count,
          })
        })
      }
      return {...state, fanData: { ...state.fanData, data: data }}
    },
    // 更新fan 结果条件
    updateFanCondition(state, { payload }) {
      return {...state, fanData: { ...state.fanData, selectCondition: payload.selectCondition }}
    },
    // fan 选择树数据更新
    updateFanTreeSelectData(state, { payload }) {
      return {...state, fanData: { ...state.fanData, treeSelectData: payload.value }}
    },
    // fan相关更新 end
    // inter相关更新 start
    updateInterData(state, { payload }) {
      const data = []
      if (payload.result === "gender") {
        payload.list.forEach(item => {
          data.push({
            x: item.id === 1 ? "男" : "女",
            y: [item.minScore, item.maxScore],
            count: item.count,
            avgScore: item.avgScore,
            midScore: item.midScore,
          })
        })
      } else if(payload.result === "flag" || payload.result === "line") {
        payload.list.forEach(item => {
          data.push({
            x: item.id ? "是" : "否",
            y: [item.minScore, item.maxScore],
            count: item.count,
            avgScore: item.avgScore,
            midScore: item.midScore,
          })
        })
      } else if(payload.result === "provolunteer") {
        payload.list.forEach(item => {
          data.push({
            x: item.id,
            y: [item.minScore, item.maxScore],
            count: item.count,
            avgScore: item.avgScore,
            midScore: item.midScore,
          })
        })
      } else if(payload.result === "profession") {
        payload.list.forEach(item => {
          data.push({
            x: state.currentSchoolData[payload.result][item.id]['name'],
            y: [item.minScore, item.maxScore],
            count: item.count,
            avgScore: item.avgScore,
            midScore: item.midScore,
          })
        })
      } else {
        payload.list.forEach(item => {
          data.push({
            x: state.currentSchoolData[payload.result][item.id],
            y: [item.minScore, item.maxScore],
            count: item.count,
            avgScore: item.avgScore,
            midScore: item.midScore,
          })
        })
      }
      return {...state, interData: { ...state.interData, data: data }}
    },
     // 更新Inter 结果条件
    updateInterCondition(state, { payload }) {
      return {...state, interData: { ...state.interData, selectCondition: payload.selectCondition }}
    },
    // Inter 选择树数据更新
    updateInterTreeSelectData(state, { payload }) {
      return {...state, interData: { ...state.interData, treeSelectData: payload.value }}
    },
    // inter 分数选择器
    updateInterScoreSelectData(state, { payload }) {
      return {...state, interData: { ...state.interData, selectScore: payload.selectScore }}
    },
    // inter 相关更新end
    // map 相关更新start
    // map data更新
    updateMapData(state, { payload }) {
      const feas = full.features.map((v, index) => {
        const sizeObj = payload.list.find(item => item.id === index)
        return {...v, properties: {...v.properties, size: sizeObj ? sizeObj.count : 0 }}
      })
      const res = {...full, features: feas}
      return {...state,
         mapData: { ...state.mapData, data: res }
        }
    },
    // map 树选择器更新
    updateMapTreeSelectData(state, { payload }) {
      return {...state, mapData: { ...state.mapData, treeSelectData: payload.value } }
    },
    // map 相关更新end 
    // ring 相关更新 start
    // ring 模式选择器更新
    updateRingMold(state, { payload }) {
      return {...state, ringData: { ...state.ringData, selectMold: payload.selectMold } }
    },
    // ring 条件选择器更新
    updateRingCondition(state, { payload }) {
      return {...state, ringData: { ...state.ringData, selectCondition: payload.selectCondition } }
    },
    // ring 数据更新
    updateRingData(state, { payload }) {
      // 排序 先按省份大排序再按专业小排序
      payload.sort((a, b) => {
        if (a.province === b.province) {
          return a.profession - b.profession
        } else {
          return a.province - b.province
        }
      })
      const newPaylod = payload.map(item => {
        item['line'] =  getLine(state.currentSchoolData.year, item.branch, item.province) // 获取分数线
        item.province = provinceList[item.province].name
        item.profession = state.currentSchoolData.profession[item.profession].name
        item.branch = state.currentSchoolData.branch[item.branch]
        item.firstPercent = `${item.firstPercent / 10}%`
        item.fullPercent = `${item.fullPercent / 10}%`
        item.lastPercent = `${item.lastPercent / 10}%`
        item.linePercent = `${item.linePercent / 10}%`
        item.flagPercent = `${item.flagPercent / 10}%`
        return item
      })
      return {...state, ringData: { ...state.ringData, data: newPaylod } }
    },
    // ring 相关更新 end
  },
}

export default Model


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