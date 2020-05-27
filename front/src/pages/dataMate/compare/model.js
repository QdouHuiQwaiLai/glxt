import { history } from 'umi'
import { getSchoolList, analStudentNumber } from './service'
import { diffSchoolList, getCurrentSchoolData } from './util'


const Model = {
  namespace: 'compare',
  state: {
    schoolList: [],  // 学校列表
    diffSchoolList: [],   // 解析散列后的学校列表
    itemList: [], // 选择列表   // sid, year, condition, data
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
    // 增加对比项目
    *addItem({ payload }, { call, put }) {
      yield put({
        type: 'updateItemList',
        payload: {},
      })
    },
    // 获取item选项下的数据
    *analItemData({ payload }, { call, put }) {
      const response = yield call(analStudentNumber, payload.requestData)
      // console.log(response)
      if (response.code === 0) {
       yield put({
          type: 'updateItemData',
          payload: {
            index: payload.index,
            data: response.data.list.length === 0 ? 0 : response.data.list[0]['count']
          },
        }); 
      }
    },
    // 学校id年份更新effect 仅为了可以做到延迟运行
    *updateItemSchoolIdYearEffect({ payload }, { call, put }) {
      yield put({
        type: 'updateItemSchoolIdYear',
        payload: payload,
      })
    },
    // 学校年份选择器修改
    *schoolSelectChange({ payload }, { call, take, select, put }) {
      // console.log(payload)
      yield put({
        type: 'updateItemSchoolIdYearEffect',
        payload: payload,
      })
      yield take('updateItemSchoolIdYearEffect/@@end')
      yield put({
        type: 'treeSelectChange',
        payload: { 
          index: payload.index,
          value: [],
          condition: {},
          scoreType: "",
          result: "null"
        },
      })
    },
    // 树条件选择器修改
    *treeSelectChange({ payload }, {  put,  select }) {
      yield put({
        type: 'updateItemTreeSelectData',
        payload: payload,
      })
      // 更新数据
      const itemList =  yield select(state => state.compare.itemList)
      yield put({
        type: 'analItemData',
        payload: { 
          index: payload.index,
          requestData: {
            sid: itemList[payload.index]['currentSchoolData'].id,
            year: itemList[payload.index]['currentSchoolData'].year,
            condition: payload.condition,
            scoreType: "",
            result: payload.result,
          },
        },
      })
    },
  },
  reducers: {
    // 更新学校列表
    updateShcoolList(state, { payload}, ) {
      return {...state, schoolList: payload, 
        diffSchoolList:diffSchoolList(payload),  
      }
    },
    // 更新item列表 // 增加
    updateItemList(state, { payload}, ) {
      if (state.diffSchoolList.length !== 0) {
        const itemList = [...state.itemList, {
          schoolId: state.diffSchoolList[0].id, // 选择的学校id
          year: state.diffSchoolList[0].year,  // 选择的学院年份
          // 当前选择的学校和年份对应的数据
          currentSchoolData: getCurrentSchoolData(state.diffSchoolList,state.diffSchoolList[0].id,state.diffSchoolList[0].year),
          treeSelectData: [], // 树选择器的数据
          count: 0,  // 查询到的数量
        }]
        return {...state, itemList: itemList}
      }
      return {...state}
    },
    // 更新当前需要更改的item的学校id 和年份
    updateItemSchoolIdYear(state, { payload}, ) {
      const { itemList } = state
      itemList[payload.index]['schoolId'] = payload.schoolId
      itemList[payload.index]['year'] = payload.year
      itemList[payload.index]['currentSchoolData'] = getCurrentSchoolData(state.diffSchoolList, payload.schoolId, payload.year)
      return {...state, itemList: itemList}
    },
    // 更新树当前item的树选择器内容
    updateItemTreeSelectData(state, { payload}, ) {
      const { itemList } = state
      itemList[payload.index]['treeSelectData'] = payload.value
      return {...state, itemList: itemList}
    },
    // 更新当前item查询到的数据
    updateItemData(state, { payload }) {
      const { itemList } = state
      itemList[payload.index]['count'] = payload.data
      return {...state, itemList: itemList}
    },
    // 更新item 删除当前选中的元素
    updateDeleteItemList(state, { payload }) {
      const { itemList } = state
      itemList.splice(payload.index, 1)
      return {...state, itemList: itemList}
    },
  },
}

export default Model