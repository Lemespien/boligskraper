<template>
  <div class="row justify-content-center">
    <div class="col-md-5">
      <h3 class="text-center">Add User</h3>
      <form @submit.prevent="onFormSubmit">
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
import { ref } from "vue";
import { db } from "../firebaseDatabase";
export default {
  setup() {
    const user = ref({});

    function onFormSubmit() {
      db.collection("users")
        .add(this.user)
        .then(() => {
          console.log("User successfully created!");
          this.user = {};
        })
        .catch((error) => console.error(error));
    }

    return {
      user,
      onFormSubmit,
    };
  },
};
</script>

<style>
</style>