import provinceList from './province'

export default (condition, currentSchoolData) => {
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
    // console.log(ele)
    // 全选等于不选
    if (Object.keys(conditionObj).indexOf(ele) !== -1) {
      delete conditionObj[ele]
      return true 
    }
    // 添加最底层的选择条件
    const [name, value] = ele.split('-')
    if (name === 'provolunteer') {  // 专业志愿号不用转换成数字
      conditionObj[name].push(value)
    } else if (name === 'profession') {
      conditionObj[name].push(currentSchoolData[name][parseInt(value)]['name'])
    } else {
      if (conditionObj[name]) {
        if (parseInt(value) || parseInt(value) === 0) {
          if (name === 'province') {
            conditionObj[name].push(provinceList[parseInt(value)].name)
          } else if (name === 'gender') {
            conditionObj[name].push(parseInt(value) === 1 ? '男' : '女')
          } else {
            conditionObj[name].push(currentSchoolData[name][parseInt(value)])
          }
        } else {
          if (value === 'true') {
            conditionObj[name].push('是')
          } else {
            conditionObj[name].push('否')
          }
        } 
      }
    }

    // 添加学院
    if (name === 'department') {
      currentSchoolData['profession'].forEach((professionEle, professionIndex) => {
        if (professionEle.parent === parseInt(value)) {
          conditionObj['profession'].push(professionEle.name)
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

  let text = ''
  const conditionText = {
    gender : '性别',
    flag : '报道',
    line : '过重点线',
    province : '省份',
    branch : '科类',
    plan : '计划',
    language : '外语语种',
    political : '政治面貌',
    feature : '特征',
    profession : '学院',
    provolunteer: '专业志愿',
  }
  Object.keys(conditionObj).forEach(key => {
    text = text + conditionText[key] + ": "
    conditionObj[key].forEach((item, index) => {
      if (conditionObj[key].length - 1 === index) {
        text = text + item
      } else {
        text = text + item + ','
      }
      
    })
    text = text + '; '
  })
  return text
}