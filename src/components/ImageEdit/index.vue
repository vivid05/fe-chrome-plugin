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
        <img ref="img" style="display: none" :src="imageUrl" alt="" />
      </div>
      <div class="info">
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
import IconInbox from '../ImageCompressor/IconInbox.vue';
import IconReset from '../ImageCompressor/IconReset.vue';
import 'cropperjs/dist/cropper.css';
import { handleInputUploadImageFile } from '@/utils/image';
import { nextTick, onUnmounted, ref } from 'vue';

const img = ref();
const imageUrl = ref('');
const imageName = ref('');
const imageSize = ref('');
const cropper = ref();
const imgWidth = ref(0);
const imgHeight = ref(0);

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
</script>

<style scoped>
.flex {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.main {
  position: relative;
  width: 60%;
  height: 100%;
}
.img-wrapper {
  position: relative;
  width: 100%;
  min-height: 70%;
}
.img-preview {
  position: absolute;
  right: 0;
  top: 0;
  width: 20%;
}
.btns {
  margin-top: 20px;
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
  margin-top: 20px;
  width: 350px;
  display: flex;
  justify-content: space-between;
}
.close {
  position: absolute;
  top: -15px;
  right: -15px;
  z-index: 9;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
