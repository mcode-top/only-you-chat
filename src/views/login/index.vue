<template>
  <div class="login-container">
    <div class="avatar">
      <img
        src="@/assets/sidebar/avatar.jpg"
        alt=""
        width="55"
        height="55"
        style="object-fit: cover; object-position: center"
      />
    </div>
    <div class="form">
      <div class="form-user">
        <img src="@/assets/login/user.png" alt="" width="20px" class="form-icon" />
        <input type="text" placeholder="用户名" v-model="formData.username" />
      </div>
      <div class="form-password">
        <img src="@/assets/login/lock.png" alt="" width="20px" class="form-icon" />
        <input
          type="password"
          placeholder="密码"
          v-model="formData.password"
          @keydown.enter="submitForm"
        />
      </div>
      <div class="form-options">
        <!-- <div class="form-checkbox">
          <input
            type="checkbox"
            name="autoLogin"
            v-model="autoLogin"
            style="margin-right: 5px; cursor: pointer"
            @change="autoLoginChange"
          />
          <label for="autoLogin" @click="(autoLogin = !autoLogin), autoLoginChange()"
            >自动登录</label
          >
        </div>
        <div class="form-checkbox">
          <input
            type="checkbox"
            name="rememberPassword"
            v-model="rememberPassword"
            style="margin-right: 5px; cursor: pointer"
            @change="rememberPasswordChange"
          />
          <label
            for="autoLogin"
            @click="(rememberPassword = !rememberPassword), rememberPasswordChange()"
            >记住密码</label
          >
        </div>
        <span class="forget-password" @click="toForgetPassword">找回密码</span> -->
      </div>
      <button class="form-button" @click="submitForm">
        <span class="form-btn-text"> 登录</span>
      </button>
    </div>
    <div class="footer">
      <div @click="toRegister" style="cursor: pointer">注册账号</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router';
import { reactive } from 'vue';
import { ElMessage } from 'element-plus';
const router = useRouter();
const formData = reactive({
  username: '',
  password: ''
});
/**@name 提交登录 */
function submitForm() {
  ElMessage({
    type: 'success',
    message: '登录成功'
  });
}
/**@name 注册页面 */
function toRegister() {
  router.push('/register');
}
</script>
<style lang="scss" scoped>
.login-container {
  display: flex;
  background-color: #fff;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 400px;
  height: 400px;
  transition: all 1s ease-in;
  opacity: 1;
  position: relative;
  border: 1px solid rgba(0, 0, 0, 0.3);
  overflow: hidden;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;

  .form {
    position: relative;
    margin-top: 35px;
    z-index: 10;

    .form-user,
    .form-password {
      position: relative;

      .form-icon {
        position: absolute;
        top: 4px;
      }

      input {
        width: 200px;
        border: 0px;
        padding: 5px 0 5px 25px;
        box-sizing: border-box;
        border-bottom: 1px solid #eee;
        font-size: 16px;
        outline: none;
        margin-bottom: 5px;

        &:focus {
          border-bottom-color: #5ccdf8;
        }
      }
    }

    .form-options {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 10px;
      color: #cacaca;

      .form-checkbox {
        display: flex;
        align-items: center;

        label {
          cursor: pointer;
        }
      }

      .forget-password {
        cursor: pointer;
        width: 50px;

        &:hover {
          color: #c0c0c0;
        }
      }
    }

    .form-button {
      cursor: pointer;
      color: white;
      background-color: #05bbfb;
      margin-top: 15px;
      width: 200px;
      height: 30px;
      border: 0;
      border-radius: 5px;
      font-size: 12px;
      box-shadow: inset 0 0px 2px rgba(0, 0, 0, 0.3);
      transition: box-shadow 0.2s ease-in-out;
      z-index: 10;

      &:active {
        box-shadow: inset 0 2px 2px rgba(0, 0, 0, 0.3);
      }
    }
  }

  .footer {
    width: 100%;
    padding: 0 5px;
    font-size: 10px;
    color: #cacaca;
    display: flex;
    justify-content: center;
    align-items: flex-end;
  }
}
</style>
