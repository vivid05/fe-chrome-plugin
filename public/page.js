window.onload = function () {
  // 深拷贝
  function deepClone(obj) {
    // 先检测是不是数组和Object
    let isArr = Array.isArray(obj);
    let isJson = Object.prototype.toString.call(obj) === '[object Object]';
    if (isArr) {
      // 克隆数组
      let newObj = [];
      for (let i = 0; i < obj.length; i++) {
        newObj[i] = deepClone(obj[i]);
      }
      return newObj;
    } else if (isJson) {
      // 克隆Object
      let newObj = {};
      for (let i in obj) {
        newObj[i] = deepClone(obj[i]);
      }
      return newObj;
    }
    // 不是引用类型直接返回
    return obj;
  }

  function createPopupBox(x, y) {
    const popupBox = document.createElement('div');
    popupBox.style.position = 'fixed';
    popupBox.style.top = y + 'px';
    popupBox.style.left = x + 'px';
    popupBox.style.background = '#fff';
    popupBox.style.padding = '8px';
    popupBox.style.border = '1px solid #ccc';
    popupBox.style.borderRadius = '8px';
    popupBox.style.cursor = 'pointer';
    popupBox.style.boxShadow = 'rgba(0,0,0,.8) 0 4px 6px -6px';
    popupBox.style.zIndex = 9999;
    return popupBox;
  }

  // 添加复制按钮
  const copyBtn = createPopupBox(0, 0);
  const pasteBtn = createPopupBox(70, 0);
  const closeBtn = createPopupBox(140, 0);
  copyBtn.textContent = '复制';
  pasteBtn.textContent = '粘贴';
  closeBtn.textContent = '关闭';
  var globalFormData = {};
  var currentInstance = null;
  // 获取表单数据
  const getComponentFormData = () => {
    const dialogWrapper = document.querySelector('.el-dialog__wrapper');
    if (!dialogWrapper || dialogWrapper.style.display === 'none') {
      document
        .querySelector('#app')
        .__vue__.$message({ type: 'warning', message: '请先打开了编辑表单' });
      return null;
    }
    try {
      const vm = document.querySelector('#app').__vue__;
      const childElementCount =
        vm.$children[0].$children[0].$children[1].$children[1].$children[0].$el.childElementCount;
      const cmp =
        childElementCount > 1
          ? vm.$children[0].$children[0].$children[1].$children[1].$children[0]
          : vm.$children[0].$children[0].$children[1].$children[1].$children[0].$children[0];
      const childrenLength = cmp.$children.length;
      currentInstance = cmp;
      let formData = {};
      // vue2.7
      if (cmp._setupProxy) {
        console.log(cmp.$children[childrenLength - 1]);
        formData =
          deepClone(cmp._setupProxy.formData) ||
          deepClone(cmp.$children[childrenLength - 1]?._setupProxy?.form) ||
          deepClone(cmp.$children[childrenLength - 1].form);
      } else {
        formData = deepClone(cmp.formData) || deepClone(cmp.$children[childrenLength - 1].form);
      }
      return formData;
    } catch (error) {
      document
        .querySelector('#app')
        .__vue__.$message({ type: 'warning', message: '获取表单数据失败' });
      console.warn(error);
      return null;
    }
  };
  // 复制
  copyBtn.onclick = () => {
    const formData = getComponentFormData();
    if (formData) {
      globalFormData = formData;
      delete globalFormData.id;
      console.log('表单数据: ', globalFormData);
      document.querySelector('#app').__vue__.$message({ type: 'success', message: '复制成功' });
    } else {
      // document.querySelector('#app').__vue__.$message({ type: 'warning', message: '抓取数据失败' })
    }
  };
  // 粘贴
  pasteBtn.onclick = () => {
    const dialogWrapper = document.querySelector('.el-dialog__wrapper');
    if (!dialogWrapper || dialogWrapper.style.display === 'none') {
      document
        .querySelector('#app')
        .__vue__.$message({ type: 'warning', message: '请先打开新增表单' });
      return;
    }
    if (!Object.keys(globalFormData).length) {
      document.querySelector('#app').__vue__.$message({ type: 'warning', message: '没有数据源' });
      return;
    }
    try {
      let childrenLength = currentInstance.$children.length;
      if (currentInstance._setupProxy) {
        if (currentInstance._setupProxy.formData) {
          currentInstance._setupProxy.formData = globalFormData;
          console.log('v3-formData', globalFormData);
        } else {
          if (currentInstance.$children[childrenLength - 1]._setupProxy) {
            for (let key in currentInstance.$children[childrenLength - 1]._setupProxy.form) {
              currentInstance.$children[childrenLength - 1]._setupProxy.form[key] =
                globalFormData[key];
            }
          } else {
            for (let key in currentInstance.$children[childrenLength - 1].form) {
              currentInstance.$children[childrenLength - 1].form[key] = globalFormData[key];
            }
          }
          console.log('v3-dialog', globalFormData);
        }
      } else {
        if (currentInstance.formData) {
          currentInstance.formData = globalFormData;
          console.log('v2-formData', currentInstance.formData);
        } else {
          currentInstance.$children[childrenLength - 1].form = globalFormData;
          console.log('v2-dialog', currentInstance.$children[childrenLength - 1].form);
        }
      }
    } catch (error) {
      document.querySelector('#app').__vue__.$message({ type: 'warning', message: '赋值失败' });
      console.warn(error);
    }
    globalFormData = {};
  };
  closeBtn.onclick = () => {
    window.copyAndPastebtnWrapper.style.display = 'none';
    globalFormData = {};
  };
  window.copyAndPastebtnWrapper = document.createElement('div');
  window.copyAndPastebtnWrapper.id = 'copy-paste';
  window.copyAndPastebtnWrapper.style.display = 'none';
  window.copyAndPastebtnWrapper.appendChild(copyBtn);
  window.copyAndPastebtnWrapper.appendChild(pasteBtn);
  window.copyAndPastebtnWrapper.appendChild(closeBtn);
  document.body.appendChild(window.copyAndPastebtnWrapper);
};
