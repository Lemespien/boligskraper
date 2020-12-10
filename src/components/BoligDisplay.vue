<template>
  <div class="row">
    <div class="col-md-12">
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Bilde</th>
            <th>Adresse</th>
            <th @click="orderBy('rooms')">Rom</th>
            <th @click="orderBy('type')">Type</th>
            <th @click="orderBy('asking_price')">Priantydning</th>
            <th @click="orderBy('total_price')">Totalpris</th>
            <th>Lenke</th>
            <th>Område</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="building in Buildings" :key="building.key">
            <td><img :src="building.image" class="table_image" /></td>
            <td>{{ building.address }}, {{ building.zip_code }}</td>
            <td>{{ building.rooms || "Ikke spesifisert" }}</td>
            <td>{{ building.type || "Ikke spesifisert" }}</td>
            <td>{{ Number(building.asking_price).toLocaleString() }}</td>
            <td>{{ Number(building.total_price).toLocaleString() }}</td>
            <td>
              <a :href="building.link">Lenke</a>
            </td>
            <td>
              {{ building.area || `${building.city}, ${building.zip_code}` }}
            </td>
            <td>
              <button
                @click.prevent="deleteUser(building.key)"
                class="btn btn-danger"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import { db } from "../firebaseDatabase";
import { ref, onMounted } from "vue";
import boligStuff from "../../data_eiendomsmegler1.json";
import dnbEiendom from "../../data_dnbeiendom.json";
import privatmeglerenData from "../../data_privatmegleren.json";

export default {
  setup() {
    const Buildings = ref([]);
    const ascending = ref(false);
    onMounted(() => {
      console.log(boligStuff);
      let eiendomsmeglerKeys = Object.keys(boligStuff);
      eiendomsmeglerKeys = eiendomsmeglerKeys.filter((key) => key.length > 0);
      eiendomsmeglerKeys.forEach((key) => {
        const infoObject = boligStuff[key];
        Buildings.value.push(infoObject);
      });

      let dnbKeys = Object.keys(dnbEiendom);
      dnbKeys = dnbKeys.filter((key) => key.length > 0);
      console.log(dnbKeys);
      dnbKeys.forEach((key) => {
        const infoObject = dnbEiendom[key];
        Buildings.value.push(infoObject);
      });
      let privatmeglerenKeys = Object.keys(privatmeglerenData);
      privatmeglerenKeys = privatmeglerenKeys.filter((key) => key.length > 0);
      console.log(privatmeglerenKeys);
      privatmeglerenKeys.forEach((key) => {
        const infoObject = privatmeglerenData[key];
        Buildings.value.push(infoObject);
      });
      console.log(Buildings.value);
      Buildings.value.sort((a, b) => (a.total_price > b.total_price ? 1 : -1));
    });

    function orderBy(orderBy) {
      // Buildings
      if (ascending.value) {
        Buildings.value.sort((a, b) => (a[orderBy] > b[orderBy] ? 1 : -1));
      } else {
        Buildings.value.sort((a, b) => (a[orderBy] > b[orderBy] ? -1 : 1));
      }
      ascending.value = !ascending.value;
      console.log(Buildings.value);
    }

    function uploadData() {
      Buildings.value.forEach((building) => {
        db.collection("buildings")
          .add(building)
          .then(() => {
            console.log("Building successfully added!");
          });
      });
    }

    function deleteUser(id) {
      if (window.confirm("Do you really want to delete?")) {
        db.collection("users")
          .doc(id)
          .delete()
          .then(() => {
            console.log("Document deleted!");
          })
          .catch((error) => console.error(error));
      }
    }
    return {
      Buildings,
      deleteUser,
      orderBy,
      uploadData,
    };
  },
};
</script>

<style>
.btn-primary {
  margin-right: 12px;
}
.table_image {
  width: 200px;
  height: 160px;
}

.table td,
.table th {
  vertical-align: middle;
}
</style>