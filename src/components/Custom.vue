<script setup>
import { ref, computed } from 'vue'

const STEP_SIZE = 50;

const profitRatios = [
    { name: 'x1.6', value: 1.66 },
    { name: 'x2', value: 2 },
    { name: 'x2.2', value: 2.2 },
    { name: 'x3.1', value: 3.1 },
    { name: 'x4.7', value: 4.7 },
    { name: 'x8.5', value: 8.5 },
    { name: 'x20', value: 20 },
    { name: 'x100', value: 100 },
    { name: 'x248', value: 248 }
];

const initialInvestment = 50;
const selectedProfitRatio = ref(profitRatios[5]);
const investList = ref([]);

const investmentResults = computed(() => {
    const results = [];
    let totalInvestment = 0;
    console.log(selectedProfitRatio.value.value)
    
    for (let index in investList.value) {
        let item = investList.value[index];
        if (!item.investment) {
            continue;
        }
        totalInvestment += item.investment;
        let grossProfit = Number.parseInt(item.investment * selectedProfitRatio.value.value);
        console.log(item.investment)
        let netProfit = Number.parseInt(grossProfit - totalInvestment);
        results.push({
            investment: item.investment,
            grossProfit: grossProfit,
            netProfit: netProfit,
            totalInvestment: totalInvestment
        });
    }

    return results;
});
const addItem = function () {
    investList.value.push({
        investment: initialInvestment,
    })
}
</script>

<template>
    <table class="mb-5 border border-collapse border-black table-auto">
        <thead>
            <tr class="text-left">
                <th class="border border-black">
                    <p class="font-bold">Loại gấp lên</p>
                </th>
                <th class="border border-black">
                    <div class="flex flex-col">
                        <label for="">Chọn tỉ lệ</label>
                        <Select v-model="selectedProfitRatio" :options="profitRatios" optionLabel="name"
                            placeholder="Chọn tỉ lệ" class="w-full md:w-56" />
                    </div>
                </th>
            </tr>
            <tr class="text-left">
                <th class="w-20 border border-black">Số trận</th>
                <th class="w-20 border border-black">Đầu tư</th>
                <th class="border border-black w-36">Lợi nhuận</th>
                <th class="border border-black w-36">Lợi nhuận ròng</th>
                <th class="border border-black w-36">Tổng đầu tư</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(result, index) in investmentResults" :key="index">
                <td class="border border-black">
                    {{ index + 1 }}
                </td>
                <td class="border border-black">
                    <InputNumber v-model="investList[index].investment" :min="STEP_SIZE" :step="STEP_SIZE" showButtons
                        class="text-sm" size="small" placeholder="Đầu tư ban đầu" aria-placeholder="Đầu tư ban đầu"
                        aria-describedby="investment-help" />
                </td>
                <td class="border border-black">{{ result.grossProfit }}</td>
                <td class="border border-black">{{ result.netProfit }}</td>
                <td class="border border-black">{{ result.totalInvestment }}</td>
            </tr>
        </tbody>
    </table>
    <Button label="Add" @click="addItem" />
</template>

<style scoped></style>