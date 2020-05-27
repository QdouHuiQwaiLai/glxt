import React, { useState } from 'react'
import { Link, connect } from 'umi'
import { history } from 'umi'
import LoginFrom from '../login/components/Login'
import styles from '../login/style.less'
import { fakeAccountRegister } from '@/services/login'
import { notification } from 'antd'

const { UserName, Password, Submit } = LoginFrom


const Register = props => {
  const handleSubmit = async (value) => {
    const response = await fakeAccountRegister({
      username: value.username,
      password: value.password,
      parent: "0",
    })
    if (response.code === 0) {
      notification.success({
        message: '注册成功',
      })
      history.push('/user/login')
    }
  }


  return (
    <div className={styles.main}>
      <LoginFrom onSubmit={handleSubmit}>
          <UserName
            name="username"
            placeholder="请输入用户名"
            rules={[
              {
                required: true,
                message: '请输入用户名!',
              },
            ]}
          />
          <Password
            name="password"
            placeholder="请输入密码"
            rules={[
              {
                required: true,
                message: '请输入密码！',
              },
            ]}
          />
        <Submit>注册</Submit>
        <div className={styles.other}>
          <Link className={styles.register} to="/user/login">
            回到登陆
          </Link>
        </div>
      </LoginFrom>
    </div>
  );
}

export default Register