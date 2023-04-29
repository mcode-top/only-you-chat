<script lang="tsx">
import { onMounted, onUnmounted, ref, useAttrs, watch } from 'vue';

interface Props {
  src: string;
  lazy?: boolean;
}
type LazyImageObserverOptions = {
  handler: (src: string) => void;
  src: string;
};
// 创建一个绑定图片元素时间的组
const imageGroup = new WeakMap<Element, LazyImageObserverOptions>();
// 开启一个全局图片拦截的监听器，如果图片到屏幕内就加载图片
const imageIntersectionObsever = new IntersectionObserver(
  (entries) => {
    entries.forEach((item) => {
      if (item.isIntersecting) {
        const op = imageGroup.get(item.target);
        if (op) {
          op.handler(op.src);
        }
      }
    });
  },
  {
    threshold: 0.1
  }
);
export default {
  props: ['src', 'lazy'],
  setup(props: Props) {
    const imgDom = ref<Element>();
    const attrs = useAttrs();
    function handler(src: string) {
      if (src && imgDom.value) {
        imgDom.value?.setAttribute('src', src);
        imageIntersectionObsever.unobserve(imgDom.value);
      }
    }
    /**@name 每次图片链接被更改就需要初始化一次 */
    function initImage() {
      if (imgDom.value) {
        imageIntersectionObsever.observe(imgDom.value);
        imageGroup.set(imgDom.value, { handler, src: props.src });
      }
    }
    onMounted(() => {
      initImage();
      watch(
        () => props.src,
        (newV, oldV) => {
          // 如果src变更则需要重新进入懒加载模式
          if (newV === '') {
            imageIntersectionObsever.unobserve(imgDom.value!);
            imgDom.value?.setAttribute('src', '');
          } else if (oldV !== newV) {
            initImage();
          }
        }
      );
    });
    onUnmounted(() => {
      if (imgDom.value) {
        imageIntersectionObsever.unobserve(imgDom.value);
      }
    });
    return () => <img {...attrs} ref={imgDom} />;
  }
};
</script>
