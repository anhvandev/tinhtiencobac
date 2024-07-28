<script setup>
import { db } from "../db.js";
import { computed, onMounted, ref, watch } from "vue";

const profitTitle = {
  1.66: "Đôi nhỏ",
  "2do": "Đỏ",
  "2xanh": "Xanh",
  2.2: "Một Đôi",
  3.1: "Hai Đôi",
  4.7: "Bộ Ba",
  8.5: "Đôi lớn",
  x20hoa: "Hòa",
  x20culu: "Cù lũ",
  100: "AA",
  248: "Tứ",
};
const profitRatios = {
  1.66: 1.66,
  "2do": 2,
  "2xanh": 2,
  2.2: 2.2,
  3.1: 3.1,
  4.7: 4.7,
  8.5: 8.5,
  x20hoa: 20,
  x20culu: 20,
  100: 100,
  248: 100,
};

const results = ref([]);
const row = {
  result: {
    1.66: {
      status: false,
      invest: 0,
    },
    "2do": {
      status: false,
      invest: 0,
    },
    "2xanh": {
      status: false,
      invest: 0,
    },
    2.2: {
      status: false,
      invest: 0,
    },
    3.1: {
      status: false,
      invest: 0,
    },
    4.7: {
      status: false,
      invest: 0,
    },
    8.5: {
      status: false,
      invest: 0,
    },
    x20hoa: {
      status: false,
      invest: 0,
    },
    x20culu: {
      status: false,
      invest: 0,
    },
    100: {
      status: false,
      invest: 0,
    },
    248: {
      status: false,
      invest: 0,
    },
  },
  time: "",
};

const calculator = ref({
  investment: 0,
  allExists: 0,
  existRatio: {
    1.66: 0,
    "2do": 0,
    "2xanh": 0,
    2.2: 0,
    3.1: 0,
    4.7: 0,
    8.5: 0,
    x20hoa: 0,
    x20culu: 0,
    100: 0,
    248: 0,
  },
});

const calc = () => {
  calculator.value.investment = 0;
  calculator.value.allExists = 0;
  const existCount = {
    1.66: 0,
    "2do": 0,
    "2xanh": 0,
    2.2: 0,
    3.1: 0,
    4.7: 0,
    8.5: 0,
    x20hoa: 0,
    x20culu: 0,
    100: 0,
    248: 0,
  };

  for (const [key] of Object.entries(profitTitle)) {
    calculator.value.existRatio[key] = 0;
    existCount[key] = 0;
  }

  results.value.map((value, index) => {
    if (index >= results.value.length - 10) {
      calculator.value.allExists++;
    }
    for (const [key] of Object.entries(profitTitle)) {
      if (index >= results.value.length - 10) {
        calculator.value.investment += value.result[key].invest;
        if (value.result[key].status) {
          existCount[key]++;
        }
      }
    }
  });

  for (const key in existCount) {
    calculator.value.existRatio[key] = (
      (existCount[key] / calculator.value.allExists) *
      100
    ).toFixed(2);
  }
};

onMounted(async () => {
  await getAllData();
  await cloneAllData();
  calc();
});

const getAllData = async () => {
  results.value = await db.vangame.toArray();
};
const cloneData = ref([]);
const cloneAllData = async () => {
  const dbdata = await db.vangame.toArray();
  cloneData.value = [];
  dbdata.forEach((value, index) => {
    cloneData.value.push(value.result);
  });
};
const addRow = () => {
  results.value.push(toNormalObject(row));
};

const save = async (id) => {
  results.value[id].time = new Date().toISOString();
  const resultID = await db.vangame.add(toNormalObject(results.value[id]));
  results.value[id] = await db.vangame.get(resultID);
  cloneAllData();
  calc();
};

const deleteRecord = async (id) => {
  db.vangame.delete(id).then(() => {
    results.value = results.value.filter((value, index) => {
      return value.id !== id;
    });
    calc();
  });
};

const deleteAll = async (id) => {
  db.vangame.clear().then(() => {
    results.value = [];
    calc();
  });
};

const saveAll = async () => {
  results.value.forEach(async (value, index) => {
    if (value.id) {
      await update(value.id, value);
    } else {
      await save(index);
    }
  });
};

const update = async (id, record) => {
  db.vangame.update(id, toNormalObject(record));
  cloneAllData();
  calc();
};

const toNormalObject = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};
</script>

<template>
  <table class="mb-48 table-auto">
    <thead>
      <tr>
        <td class="text-center border border-black w-52"></td>
        <td
          class="w-20 text-center border border-black"
          v-for="(ratio, index) in profitTitle"
          :key="index"
        >
          {{ ratio }}
        </td>
        <td class="text-center border border-black w-52">
          <p>Action</p>
          <Button
            size="small"
            label="Save All"
            icon="pi pi-save"
            icon-pos="right"
            @click="saveAll"
          />
        </td>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(record, index) in results"
        :key="index"
      >
        <td class="p-2 text-center border border-black w-52">
          {{ index + 1 }}
        </td>
        <td
          class="w-20 p-2 text-center border border-black"
          v-for="(ratioResult, key) in record.result"
          :key="index + '-' + key"
        >
          <div class="flex flex-col">
            <input
              class="scale-150"
              type="checkbox"
              v-model="results[index].result[key].status"
              :inputId="(record.id || index) + '-' + key"
              :name="(record.id || index) + '-' + key"
              :value="true"
            />
          </div>
        </td>
        <td class="p-2 space-x-2 text-center border border-black w-52">
          <Button
            v-if="!record.id"
            size="small"
            label="Save"
            icon="pi pi-save"
            icon-pos="right"
            @click="save(index)"
          />
          <Button
            v-if="record.id"
            size="small"
            label="Update"
            icon="pi pi-save"
            icon-pos="right"
            @click="update(record.id, record)"
          />
          <Button
            v-if="record.id"
            size="small"
            label="Delete"
            severity="danger"
            icon="pi pi-trash"
            icon-pos="right"
            @click="deleteRecord(record.id)"
          />
        </td>
      </tr>
      <tr>
        <td
          colspan="13"
          class="p-4 space-x-4 text-center border border-black"
        >
          <Button
            size="small"
            label="Add"
            icon="pi pi-plus"
            icon-pos="right"
            @click="addRow"
          />
          <Button
            size="small"
            label="Save All"
            icon="pi pi-save"
            icon-pos="right"
            @click="saveAll"
          />
          <Button
            size="small"
            label="Delete all"
            icon="pi pi-save"
            icon-pos="right"
            severity="danger"
            @click="deleteAll"
          />
        </td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <td class="text-center border border-black w-52"></td>
        <td
          class="w-20 text-center border border-black"
          v-for="(ratio, index) in profitTitle"
          :key="index"
        >
          <div class="flex flex-col">
            <span>{{ ratio }} </span>
            <span>{{ index }} </span>
          </div>
        </td>
        <td
          rowspan="2"
          class="space-x-2 text-center border border-black w-52"
        >
          <p>Action</p>
          <Button
            size="small"
            label="Save All"
            icon="pi pi-save"
            icon-pos="right"
            @click="saveAll"
          />
          <Button
            size="small"
            label="Delete all"
            icon="pi pi-save"
            icon-pos="right"
            severity="danger"
            @click="deleteAll"
          />
        </td>
      </tr>
      <tr>
        <td class="text-center border border-black w-52">
          <div class="flex flex-col"></div>
        </td>
        <td
          class="w-20 text-center border border-black"
          v-for="(ratio, index) in profitTitle"
          :key="index"
        >
          <div class="flex flex-col">
            <span>{{ calculator.existRatio[index] + "%" }}</span>
          </div>
        </td>
      </tr>
    </tfoot>
  </table>
  <textarea
    class="hidden"
    cols="100"
    rows="10"
    >{{ JSON.stringify(cloneData) }}</textarea
  >
</template>
