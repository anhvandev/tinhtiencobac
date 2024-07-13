<script setup>
import { ref, reactive, watch } from 'vue'
const limit = 23;
const tysoloinhuan = ref([
    { name: 'x1.6', value: 1.66 },
    { name: 'x2', value: 2 },
    { name: 'x2.2', value: 2.2 },
    { name: 'x3.1', value: 3.1 },
    { name: 'x4.7', value: 4.7 },
    { name: 'x8.5', value: 8.5 },
    { name: 'x20', value: 20 },
    { name: 'x100', value: 100 },
    { name: 'x248', value: 248 }
]);
const soLanGap = ref([
    { name: 'x2', value: 2 },
    { name: 'x3', value: 3 },
    { name: 'x4', value: 4 },
]);

const inputGapDoi = ref(50);
let tmpInputGapDoi = 0;
const selectedGapDoi = ref(tysoloinhuan.value.at(0));
const selectedLanGap = ref(soLanGap.value.at(0));
let tongGapDoi = 0;
watch(selectedGapDoi, (newValue, oldValue) => {
    tongGapDoi = 0;
});
watch(selectedLanGap, (newValue, oldValue) => {
    tongGapDoi = 0;
});
watch(inputGapDoi, (newValue, oldValue) => {
    tongGapDoi = 0;
});

</script>

<template>
    <main>
        <table class="table-auto">
            <thead>
                <tr class="text-left">
                    <th>
                        <p class="font-bold">Loại gấp đôi</p>
                    </th>
                    <th>
                        <Select v-model="selectedGapDoi" :options="tysoloinhuan" optionLabel="name"
                            placeholder="Chọn mốc" class="w-full md:w-56" />
                    </th>
                    <th>
                        <Select v-model="selectedLanGap" :options="soLanGap" optionLabel="name"
                            placeholder="Chọn lần gấp" class="w-full md:w-56" />
                    </th>
                </tr>
                <tr class="text-left">
                    <th class="w-20">Tiền vào</th>
                    <th class="w-36">Lãi ròng</th>
                    <th class="w-36">Chi ra</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <InputNumber v-model="inputGapDoi" :min="50" :step="50" showButtons class="text-sm" size="small"
                            placeholder="Vào đầu" aria-placeholder="Vào đầu" aria-describedby="username-help" />
                        <div v-if="false">
                            {{ tmpInputGapDoi = inputGapDoi }}
                        </div>
                    </td>
                    <td>
                        {{ inputGapDoi * selectedGapDoi.value }}
                    </td>
                    <td>
                        {{ tongGapDoi = tongGapDoi + inputGapDoi }}
                    </td>
                </tr>
                <tr v-for="index in limit">
                    <td>
                        {{ tmpInputGapDoi = tmpInputGapDoi * selectedLanGap.value }}
                    </td>
                    <td>
                        {{ inputGapDoi * selectedGapDoi.value }}
                    </td>
                    <td>
                        {{ tongGapDoi = tongGapDoi + inputGapDoi }}
                    </td>
                </tr>
            </tbody>
        </table>
    </main>
</template>

<style scoped></style>