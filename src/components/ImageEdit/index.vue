<template>
  <div class="main flex" @click.stop="stopPropagation">
    <template v-if="imageUrl">
      <div class="img-wrapper">
        <em
          class="_close_kat5x_7 u-icon icon-close u-link g-pa close"
          title="点击重置图片"
          @click="resetImage"
        >
          <icon-reset />
        </em>
        <img ref="img" :src="imageUrl" alt="" style="max-width: 100%; max-height: 100%; object-fit: contain;" />
      </div>
      <div class="info">
        <div class="size-info">
          <div>
            <span>宽：</span>
            <span>{{ imgWidth }}</span>
          </div>
          <div>
            <span>高：</span>
            <span>{{ imgHeight }}</span>
          </div>
          <div>
            <span>图片大小：</span>
            <span>{{ imageSize }}KB</span>
          </div>
        </div>
        <div class="crop-inputs">
          <div class="input-group">
            <label>裁剪宽度：</label>
            <input 
              v-model.number="cropWidth" 
              type="number" 
              placeholder="像素"
              @input="onCropSizeChange"
            />
          </div>
          <div class="input-group">
            <label>裁剪高度：</label>
            <input 
              v-model.number="cropHeight" 
              type="number" 
              placeholder="像素"
              @input="onCropSizeChange"
            />
          </div>
          <button class="crop-btn" @click="applyCropSize">应用尺寸</button>
        </div>
      </div>
      <div class="btns">
        <button class="primary" style="margin-right: 10px" title="翻转" @click="onRotate(-45)">
          ↺
        </button>
        <button class="primary" title="翻转" @click="onRotate(45)">↻</button>
      </div>
      <div class="btns">
        <button class="success" style="margin-right: 10px" @click="onSave">保存</button>
        <button @click="onReset">重置</button>
      </div>
    </template>
    <template v-else>
      <input
        ref="uploadPic"
        class="z-hide"
        type="file"
        accept="image/*"
        name="image"
        @change="_handleInputChange"
      />
      <div
        id="dragbox"
        class="u-link f-tc g-center _box_kat5x_1"
        s-bg_white
        @click.stop="handleBoxClick"
      >
        <!-- 文件上传交互入口，点击/拖拽文件上传 -->
        <icon-inbox />
        <p class="g-fs14" s-ft_sub>
          点击上传图片<br />
          <em class="g-fs12">(*.jpg/*.png/*.gif格式)</em>
        </p>
        <em
          class="_close_kat5x_7 u-icon icon-close u-link g-pa close"
          title="点击重置图片"
          @click.stop="back"
        >
          <icon-reset />
        </em>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'ImageEdit',
};
</script>
<script setup>
import Cropper from 'cropperjs';
import IconInbox from './IconInbox.vue';
import IconReset from './IconReset.vue';
import 'cropperjs/dist/cropper.css';
import { handleInputUploadImageFile } from '@/utils/image';
import { nextTick, onUnmounted, ref } from 'vue';

defineProps({
  back: {
    type: Function,
    default: () => {},
  },
});

const img = ref();
const imageUrl = ref('');
const imageName = ref('');
const imageSize = ref('');
const cropper = ref();
const imgWidth = ref(0);
const imgHeight = ref(0);
const cropWidth = ref('');
const cropHeight = ref('');

onUnmounted(() => {
  cropper.value && cropper.value.destroy();
});

const stopPropagation = () => {
  return false;
};

const uploadPic = ref();
const handleBoxClick = () => {
  uploadPic.value.click();
};

const handleFileList = fileList => {
  handleInputUploadImageFile(fileList, 1)
    .then(({ imgUrl, imgName, imgSize }) => {
      imageUrl.value = imgUrl;
      imageName.value = imgName;
      imageSize.value = imgSize;
      nextTick(() => {
        if (imgUrl) {
          cropper.value = new Cropper(img.value, {
            preview: '.img-preview',
            crop({ detail }) {
              imgWidth.value = Math.floor(detail.width);
              imgHeight.value = Math.floor(detail.height);
            },
          });
        }
      });
    })
    .catch(e => alert(e));
};

const _handleInputChange = e => {
  if (!e || !(e.target instanceof HTMLInputElement)) return;
  handleFileList(e.target.files);
  console.log(e.target.files[0]);
};

const resetImage = () => {
  imageUrl.value = '';
};

const onRotate = val => {
  cropper.value.rotate(val);
};

const getFileData = data => {
  let binary = atob(data.split(',')[1]);
  let mime = data.split(',')[0].match(/:(.*?);/)[1];
  let array = [];
  for (let i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  return new Blob([new Uint8Array(array)], { type: mime });
};
const onSave = () => {
  const base64 = cropper.value.getCroppedCanvas().toDataURL('image/png');
  const link = document.createElement('a');
  const fileData = getFileData(base64);
  const url = URL.createObjectURL(fileData);
  link.download = imageName.value;
  link.href = url;
  link.click();
};
const onReset = () => {
  cropper.value.reset();
};

const onCropSizeChange = () => {
  // 输入框值变化时的实时反馈
  if (cropWidth.value && cropHeight.value && cropper.value) {
    const imageData = cropper.value.getImageData();
    const canvasData = cropper.value.getCanvasData();
    
    // 计算合适的起始位置（居中）
    const startX = Math.max(0, (imageData.naturalWidth - cropWidth.value) / 2);
    const startY = Math.max(0, (imageData.naturalHeight - cropHeight.value) / 2);
    
    // 确保裁剪尺寸不超过图片尺寸
    const maxWidth = Math.min(cropWidth.value, imageData.naturalWidth);
    const maxHeight = Math.min(cropHeight.value, imageData.naturalHeight);
    
    cropper.value.setCropBoxData({
      left: canvasData.left + startX * canvasData.width / imageData.naturalWidth,
      top: canvasData.top + startY * canvasData.height / imageData.naturalHeight,
      width: maxWidth * canvasData.width / imageData.naturalWidth,
      height: maxHeight * canvasData.height / imageData.naturalHeight
    });
  }
};

const applyCropSize = () => {
  if (!cropWidth.value || !cropHeight.value) {
    alert('请输入有效的宽度和高度');
    return;
  }
  
  if (!cropper.value) {
    alert('请先上传图片');
    return;
  }
  
  onCropSizeChange();
};
</script>

<style scoped>
.flex {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100%;
}
.main {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow-y: auto;
  padding: 20px;
  box-sizing: border-box;
}
.img-wrapper {
  position: relative;
  width: 100%;
  max-height: 60vh;
  min-height: 300px;
  overflow: hidden;
  margin-bottom: 20px;
}
.img-preview {
  position: absolute;
  right: 0;
  top: 0;
  width: 20%;
}
.btns {
  margin-bottom: 20px;
}

.btns:last-of-type {
  margin-bottom: 40px;
}
.btns > button {
  background: #fff;
  border: 1px solid #dcdfe6;
  border-color: #dcdfe6;
  color: #606266;
  padding: 8px 12px;
  border-radius: 6px;
}
.btns > .primary {
  color: #fff;
  background-color: #007bff;
  border-color: #007bff;
}
.btns > .success {
  color: #fff;
  background-color: #28a745;
  border-color: #28a745;
}
.info {
  margin: 20px 0 10px 0;
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.size-info {
  display: flex;
  justify-content: space-between;
  background: #f5f5f5;
  padding: 10px 15px;
  border-radius: 6px;
  font-size: 14px;
}

.size-info > div {
  display: flex;
  align-items: center;
  gap: 5px;
}

.crop-inputs {
  background: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  padding: 15px;
}

.input-group {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  gap: 10px;
}

.input-group:last-of-type {
  margin-bottom: 15px;
}

.input-group label {
  min-width: 80px;
  font-size: 14px;
  color: #606266;
}

.input-group input {
  flex: 1;
  max-width: 120px;
  padding: 6px 10px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
}

.input-group input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.1);
}

.crop-btn {
  width: 100%;
  padding: 8px 16px;
  background-color: #17a2b8;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.crop-btn:hover {
  background-color: #138496;
}

.crop-btn:active {
  background-color: #117a8b;
}
.close {
  position: absolute;
  top: 0px;
  right: 0px;
  z-index: 9;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
