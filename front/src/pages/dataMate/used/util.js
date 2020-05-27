export const diffSchoolList = (schoolList) => {
  const diffSchollList = []
  schoolList.forEach(school => school.data.forEach(schoolItem => 
      diffSchollList.push({
        id: school.id,
        name: school.name,
        uid: school.uid,
        ...schoolItem
      })
    )
  )
  return diffSchollList
}

export const getSchoolFirstYear = (schoolList, value) => { 
  return schoolList.find(school => school.id === value).data[0].year
}

export const getCurrentSchoolData = (diffSchoolList, id, year) => {
  return diffSchoolList.find(school => school.id === id && school.year === year)
}