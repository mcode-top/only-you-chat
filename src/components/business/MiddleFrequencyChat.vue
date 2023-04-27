<!-- 居中的音频谱图 -->

<template>
  <canvas ref="canvasRef"></canvas>
</template>
<script setup lang="ts">
import { ref, defineProps, watch } from 'vue';

const props = withDefaults(
  defineProps<{
    frequencyData: Uint8Array | undefined;
    // 条形图的总数
    barTotal: number;
    setRgb?: (barWidth: number, barHight: number) => string;
  }>(),
  {
    setRgb: (barWidth: number, barHight: number) => `rgb(${barHight}, 169, 255)`
  }
);
const canvasRef = ref<HTMLCanvasElement | null>(null);

function draw(data: Uint8Array) {
  // 将频率谱图数据通过Canvas绘制出时域图
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d')!;
  var bufferLength = props.barTotal;
  const width = canvas.width;
  const height = canvas.height;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = 'rgba(0, 0, 0,0.1)';
  ctx.fillRect(0, 0, width, height);
  const barWidth = (width / bufferLength) * 2.5;
  let barHeight;
  let x = 0;
  for (let i = 0; i < bufferLength; i++) {
    barHeight = data[i] * 1;
    ctx.fillStyle = props.setRgb(barWidth, barHeight);
    ctx.fillRect(x, (height - barHeight) / 2, barWidth, barHeight);

    x += barWidth + 1;
  }
}
watch(
  () => props.frequencyData,
  (data) => {
    if (data) {
      draw(data);
    }
  },
  {
    immediate: true
  }
);
</script>
