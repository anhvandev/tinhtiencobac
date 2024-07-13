<script setup>
import { ref, computed } from 'vue'

const MAX_ITERATIONS = 24;

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

const multiplicationFactors = [
    { name: 'x2', value: 2 },
    { name: 'x3', value: 3 },
    { name: 'x4', value: 4 },
];

const initialInvestment = ref(50);
const selectedProfitRatio = ref(profitRatios[0]);
const selectedMultiplicationFactor = ref(multiplicationFactors[0]);

const investmentResults = computed(() => {
    const results = [];
    let currentInvestment = initialInvestment.value;
    let totalInvestment = 0;

    for (let i = 0; i < MAX_ITERATIONS; i++) {
        totalInvestment += currentInvestment;
        const grossProfit = currentInvestment * selectedProfitRatio.value.value;
        const netProfit = grossProfit - totalInvestment;
        
        results.push({
            investment: currentInvestment,
            netProfit,
            totalInvestment
        });

        currentInvestment *= selectedMultiplicationFactor.value.value;
    }

    return results;
});

</script>

<template>
    <main>
        <table class="table-auto">
            <thead>
                <tr class="text-left">
                    <th>
                        <p class="font-bold">Loại tỉ lệ lợi nhuận</p>
                    </th>
                    <th>
                        <Select v-model="selectedProfitRatio" :options="profitRatios" optionLabel="name"
                            placeholder="Chọn tỉ lệ" class="w-full md:w-56" />
                    </th>
                    <th>
                        <Select v-model="selectedMultiplicationFactor" :options="multiplicationFactors" optionLabel="name"
                            placeholder="Chọn hệ số nhân" class="w-full md:w-56" />
                    </th>
                </tr>
                <tr class="text-left">
                    <th class="w-20">Đầu tư</th>
                    <th class="w-36">Lợi nhuận ròng</th>
                    <th class="w-36">Tổng đầu tư</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(result, index) in investmentResults" :key="index">
                    <td>
                        <InputNumber v-if="index === 0" v-model="initialInvestment" :min="50" :step="50" showButtons
                            class="text-sm" size="small" placeholder="Đầu tư ban đầu" aria-placeholder="Đầu tư ban đầu"
                            aria-describedby="investment-help" />
                        <p v-else>{{ result.investment }}</p>
                    </td>
                    <td>{{ Number.parseInt(result.netProfit) }}</td>
                    <td>{{ result.totalInvestment }}</td>
                </tr>
            </tbody>
        </table>
    </main>
</template>

<style scoped></style>