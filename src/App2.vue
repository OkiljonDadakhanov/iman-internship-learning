<script setup>
import { ref, onMounted } from "vue";

// Make variables reactive
const name = ref("Akilhan Dadakhanov");
const status = ref("active");
const tasks = ref(["task1", "task2", "task3", "task4"]);
const newTask = ref("");

// Define the toggleStatus function
const toggleStatus = () => {
  if (status.value === "active") {
    status.value = "pending";
  } else if (status.value === "pending") {
    status.value = "inactive";
  } else {
    status.value = "active";
  }
};

console.log(name.value);

const addTask = () => {
  if (newTask.value.trim() !== "") {
    tasks.value.push(newTask.value);
    newTask.value = "";
  }
};

const deleteTask = (index) => {
  tasks.value.splice(index, 1);
};

onMounted(async () => {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos");
    const data = await response.json();
    tasks.value = data.map((task) => task.title);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});
</script>

<template>
  <h1>{{ name }}</h1>
  <p v-if="status === 'active'">The user is active.</p>
  <p v-else-if="status === 'pending'">The user is pending.</p>
  <p v-else>The user is inactive.</p>

  <form action="" @submit.prevent="addTask">
    <label for="newTask">Add Task</label>
    <input type="text" id="newTask" name="newTask" v-model="newTask" />
    <button type="submit">Submit</button>
  </form>

  <h1>Tasks:</h1>
  <ul>
    <li v-for="(task, index) in tasks" :key="task">
      <span>
        {{ task }}
      </span>
      <button @click="deleteTask(index)">Delete</button>
    </li>
  </ul>

  <br />
  <button @click="toggleStatus">Change status</button>
</template>
