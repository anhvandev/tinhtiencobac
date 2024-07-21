<script setup>
import { db } from '../db.js';
import { computed, onMounted, ref, watch } from 'vue';

const profitRatios = {
    '1.66': "Đôi nhỏ",
    '2do': "Đỏ",
    '2xanh': "Xanh",
    '2.2': "Một Đôi",
    '3.1': "Hai Đôi",
    '4.7': "Bộ Ba",
    '8.5': "Đôi lớn",
    'x20hoa': "Hòa",
    'x20culu': "Cù lũ",
    '100': "AA",
    '248': "Tứ"
};

const results = ref([]);
const row = {
    result: {
        '1.66': false,
        '2do': false,
        '2xanh': false,
        '2.2': false,
        '3.1': false,
        '4.7': false,
        '8.5': false,
        'x20hoa': false,
        'x20culu': false,
        '100': false,
        '248': false
    },
    time: ''
};

onMounted(async () => {
    await getAllData();
    await cloneAllData();
    
})

const getAllData = async () => {
    results.value = await db.vangame.toArray();
}
const cloneData = ref([]);
const cloneAllData = async () => {
    const dbdata = await db.vangame.toArray();
    cloneData.value = [];
    dbdata.forEach((value, index) => {
        cloneData.value.push(value.result);
    });
}
const addRow = () => {
    results.value.push(toNormalObject(row));
}

const save = async (id) => {
    results.value[id].time = (new Date()).toISOString();
    const resultID = await db.vangame.add(toNormalObject(results.value[id]));
    results.value[id] = await db.vangame.get(resultID);
    cloneAllData();
}

const saveAll = async () => {
    results.value.forEach(async (value, index) => {
        if (value.id) {
            await update(value.id, value)
        } else {
            await save(index);
        }
    });
}

const update = async (id, record) => {
    db.vangame.update(id, toNormalObject(record));
    cloneAllData();
}

const toNormalObject = (obj) => {
    return JSON.parse(JSON.stringify(obj));
}
</script>

<template>
    <table class="table-auto">
        <thead>
            <tr>
                <td class="text-center border border-black w-52"></td>
                <td class="w-20 text-center border border-black" v-for="(ratio, index) in profitRatios" :key="index">
                    {{ ratio }}
                </td>
                <td class="text-center border border-black w-52">
                    <p>Action</p>
                    <Button size="small" label="Save All" icon="pi pi-save" icon-pos="right" @click="saveAll" />
                </td>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(record, index) in results" :key="index">
                <td class="p-2 text-center border border-black w-52">{{ index + 1 }}</td>
                <td class="w-20 p-2 text-center border border-black" v-for="(ratioResult, key) in record.result"
                    :key="index + '-' + key">
                    <input class="scale-150" type="checkbox" v-model="results[index].result[key]"
                        :inputId="(record.id || index) + '-' + key" :name="(record.id || index) + '-' + key"
                        :value="true" />
                </td>
                <td class="p-2 text-center border border-black w-52">
                    <Button v-if="!record.id" size="small" label="Save" icon="pi pi-save" icon-pos="right"
                        @click="save(index)" />
                    <Button v-if="record.id" size="small" label="Save" icon="pi pi-save" icon-pos="right"
                        @click="update(record.id, record)" />
                </td>
            </tr>
            <tr>
                <td colspan="13" class="p-4 space-x-4 text-center border border-black">
                    <Button size="small" label="Add" icon="pi pi-plus" icon-pos="right" @click="addRow" />
                    <Button size="small" label="Save All" icon="pi pi-save" icon-pos="right" @click="saveAll" />
                </td>
            </tr>
        </tbody>
        <tfoot>
            <td class="text-center border border-black w-52"></td>
            <td class="w-20 text-center border border-black" v-for="(ratio, index) in profitRatios" :key="index">
                {{ ratio }}
            </td>
            <td class="text-center border border-black w-52">
                <p>Action</p>
                <Button size="small" label="Save All" icon="pi pi-save" icon-pos="right" @click="saveAll" />
            </td>
        </tfoot>
    </table>
    <textarea cols="100" rows="10">{{ JSON.stringify(cloneData) }}</textarea>
</template>