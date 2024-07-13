<script setup>
import { ref, computed } from 'vue'

const MAX_ITERATIONS = ref(24);
const STEP_SIZE = 50

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

const initialInvestment = ref(50);
const selectedProfitRatio = ref(profitRatios[3]);
const cutLoss = ref(11);
const STOP_LOSS_LEVEL = ref(-STEP_SIZE * 3);

const investmentResults = computed(() => {
    const results = [];
    let currentInvestment = initialInvestment.value;
    let totalInvestment = 0;

    for (let i = 0; i < MAX_ITERATIONS.value; i++) {
        totalInvestment += currentInvestment;
        let grossProfit = Number.parseInt(currentInvestment * selectedProfitRatio.value.value);
        let netProfit = Number.parseInt(grossProfit - totalInvestment);

        while (netProfit <= 0) {
            currentInvestment += STEP_SIZE;
            totalInvestment += STEP_SIZE;
            grossProfit = Number.parseInt(currentInvestment * selectedProfitRatio.value.value);
            netProfit = Number.parseInt(grossProfit - totalInvestment);
        }

        if (cutLoss.value > 0 && i >= cutLoss.value) {
            while (netProfit >= STOP_LOSS_LEVEL.value) {
                currentInvestment -= STEP_SIZE;
                totalInvestment -= STEP_SIZE;
                grossProfit = Number.parseInt(currentInvestment * selectedProfitRatio.value.value);
                netProfit = Number.parseInt(grossProfit - totalInvestment);
            }
        }

        results.push({
            investment: currentInvestment,
            grossProfit,
            netProfit,
            totalInvestment
        });
    }

    return results;
});
</script>

<template>
    <table class="border border-collapse border-black table-auto">
        <thead>
            <tr class="text-left">
                <th class="border border-black">
                    <p class="font-bold">Loại Chày cối</p>
                </th>
                <th class="border border-black">
                    <label for="">Chọn tỉ lệ</label>
                    <Select v-model="selectedProfitRatio" :options="profitRatios" optionLabel="name"
                        placeholder="Chọn tỉ lệ" class="w-full md:w-56" />
                </th>
                <th class="border border-black">
                    <div class="flex flex-col">
                        <label for="">Mức cắt lỗ</label>

                        <InputNumber v-model="STOP_LOSS_LEVEL" :step="STEP_SIZE" showButtons class="text-sm"
                            size="small" placeholder="Mức cắt lỗ" aria-placeholder="Mức cắt lỗ"
                            aria-describedby="investment-help" />
                    </div>
                </th>
                <th class="border border-black">
                    <label for="">Cắt lỗ tại</label>
                    <InputNumber v-model="cutLoss" showButtons class="text-sm" :min="0" size="small"
                        placeholder="Cắt lỗ tại" aria-placeholder="Cắt lỗ tại"
                        aria-describedby="investment-help" />
                </th>
                <th class="border border-black">
                    <div class="flex flex-col">
                        <label for="">Số trận</label>

                        <InputNumber v-model="MAX_ITERATIONS" showButtons class="text-sm"
                            size="small" placeholder="Số trận" aria-placeholder="Mức cắt lỗ"
                            aria-describedby="investment-help" />
                    </div>
                </th>
            </tr>
            <tr class="text-left">
                <th class="border border-black w-28">Số trận</th>
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
                    <InputNumber v-if="index === 0" v-model="initialInvestment" :min="50" :step="50" showButtons
                        class="text-sm" size="small" placeholder="Đầu tư ban đầu" aria-placeholder="Đầu tư ban đầu"
                        aria-describedby="investment-help" />
                    <p v-else>{{ result.investment }}</p>
                </td>
                <td class="border border-black">{{ result.grossProfit }}</td>
                <td class="border border-black">{{ result.netProfit }}</td>
                <td class="border border-black">{{ result.totalInvestment }}</td>
            </tr>
        </tbody>
    </table>
</template>

<style scoped></style>