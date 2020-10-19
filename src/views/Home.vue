<template>
  <ul>
    <li v-for="student of students" :key="student['.key']">
      {{ student.id }} <br />
      {{ student.name }}<br />
      {{ student.email }}
    </li>
  </ul>
</template>

<script>
import { db } from "../firebaseDatabase";
import { ref, onMounted } from "vue";
export default {
  setup() {
    const students = ref([]);

    function created() {
      db.collection("students")
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            let item = doc.data();
            item.id = doc.id;
            students.value.push(item);
          });
        });
    }

    onMounted(() => created());

    return {
      students,
      created,
    };
  },
};
</script>
