<template>
  <div class="register-container">
    <div class="form">
      <div class="form-user">
        <img src="@/assets/login/user.png" alt="" width="20px" class="form-icon" />
        <input type="text" placeholder="用户名" v-model="formData.username" />
      </div>
      <div class="form-password">
        <img src="@/assets/login/lock.png" alt="" width="20px" class="form-icon" />
        <input type="password" placeholder="密码" v-model="formData.password" />
      </div>
      <button class="form-button" @click="submitForm">
        <span class="form-btn-text"> 注册</span>
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const formData = reactive({
  password: '',
  username: ''
});
function submitForm() {
  router.replace('/login');
  ElMessage('注册成功');
}
</script>
<style lang="scss" scoped>
.register-container {
  background-color: #fff;
  display: flex;
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
    margin-top: 20px;
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

    .form-code {
      position: relative;

      .code {
        position: absolute;
        right: 0px;
        top: 0;
      }

      input {
        width: 200px;
        border: 0px;
        padding: 5px 0;
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
      margin-top: 10px;
      width: 200px;
      height: 30px;
      border: 0;
      border-radius: 5px;
      font-size: 12px;
      box-shadow: inset 0 0px 2px rgba(0, 0, 0, 0.3);
      transition: box-shadow 0.2s ease-in-out;

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
    justify-content: space-between;
    align-items: flex-end;
  }
}
</style>
