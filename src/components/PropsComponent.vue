

<script lang="tsx">
import { onMounted, defineEmits, ref } from 'vue';
import { globalCount } from "../reactive/test"

interface Props {
    name: string;
    age?: number
}
const MyIsJsx = function ({ age = 10, name }: {
    name: string,
    age?: number
}) {

    return <div>{name} + GGBOOM {age} </div>
}
export default {
    emits: ['cc'],
    setup(props: Props, ctx) {
        const ss = ref(0)
        function arg() {
            console.log(1)
        }
        // const evt = defineEmits<{
        //     (event: "cc", fu: Function): void
        // }>()
        onMounted(() => {
            console.log(ctx)
            ctx.emit("cc", arg, MyIsJsx)
            // evt("cc", arg)
        })
        console.log(1)
        return () => {
            console.log(2)

            return <div>
                {globalCount.value} fuck angle {globalCount.value} {props.name} {ss.value}
                <br />
                <button onClick={() => {
                    ss.value++;
                }}>increment</button>
            </div>
        }
    }
}
</script>