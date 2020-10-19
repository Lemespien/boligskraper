<template>
  <div class="row justify-content-center">
    <div class="col-md-5">
      <h3 class="text-center">Update User</h3>
      <form @submit.prevent="onUpdateForm">
        <div class="form-group">
          <label for="name">Name</label>
          <input
            type="text"
            class="form-control"
            v-model="user.name"
            required
          />
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            class="form-control"
            v-model="user.email"
            required
          />
        </div>
        <div class="form-group">
          <label for="name">Phone</label>
          <input
            type="text"
            class="form-control"
            v-model="user.phone"
            required
          />
        </div>
        <div class="form-group">
          <button class="btn btn-primary btn-block">Add User</button>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import { db } from "../firebaseDatabase";
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
export default {
  setup() {
    const user = ref({});
    const { params } = useRoute();
    const router = useRouter();
    onMounted(() => {
      let dbRef = db.collection("users").doc(params.id);
      dbRef
        .get()
        .then((doc) => {
          user.value = doc.data();
        })
        .catch((error) => console.error(error));
    });

    function onUpdateForm() {
      db.collection("users")
        .doc(params.id)
        .update(user.value)
        .then(() => {
          console.log("User successfully updated!");
          router.push("/list");
        })
        .catch((error) => console.error(error));
    }

    return {
      user,
      onUpdateForm,
    };
  },
};
</script>

<style>
</style>