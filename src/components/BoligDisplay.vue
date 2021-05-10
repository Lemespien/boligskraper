<template>
  <div>
    <div class="form-row align-items-center">
      <div class="form-group col-md-4">
        <label for="search">Søk på adresse eller lenke</label>
        <input
          class="form-control"
          type="text"
          name="search"
          id="search"
          placeholder="Søk adresse/lenke"
          v-model="searchText"
          @change="searchAll"
        />
      </div>
      <div class="form-group col-md-2">
        <label for="priceFrom">Pris fra (Prisantydning)</label>
        <input
          class="form-control"
          type="text"
          name="priceFrom"
          id="searchPriceFrom"
          pattern="([0-9]+.{0,1}[0-9]*,{0,1})*[0-9]"
          placeholder="Pris fra"
          v-model="searchPriceFrom"
          @change="searchAll"
        />
      </div>
      <div class="form-group col-md-2">
        <label for="priceTo">Pris til (Prisantydning)</label>
        <input
          class="form-control"
          type="text"
          name="priceTo"
          id="searchPriceTo"
          pattern="([0-9]+.{0,1}[0-9]*,{0,1})*[0-9]"
          placeholder="Pris til"
          v-model="searchPriceTo"
          @change="searchAll"
        />
      </div>
      <div class="form-group col-md-1">
        <label for="bedrooms">Soverom</label>
        <select
          class="form-control"
          v-model="searchBedroom"
          name="bedrooms"
          @change="searchAll"
        >
          <option
            v-for="bedroom in parseInt(bedroomCount)"
            v-bind:key="bedroom"
            :value="bedroom"
          >
            {{ bedroom }}
          </option>
        </select>
      </div>
      <div class="form-group col-md-1 align-self-end">
        <button class="btn btn-primary" @click="searchAll">Søk</button>
      </div>
      <div class="form-group col-md-2 align-self-end" v-if="searchResult.length > 0">
        <button class="btn btn-primary" @click="clearFilter">
          Reset filter
        </button>
      </div>
    </div>
  </div>
  <div class="row" v-if="searchResult.length > 0">
    <div class="searchWrapper col-md-12">
      <div class="row">
        <div class="col-md-6 offset-md-3">
          <h3>Søkeresultat</h3>
        </div>
      </div>
      <table class="table table-primary">
        <thead>
          <tr>
            <th>Bilde</th>
            <th>Adresse</th>
            <th @click="orderBy('rooms')">Soverom</th>
            <th>Size</th>
            <th @click="orderBy('type')">Type</th>
            <th @click="orderBy('asking_price')">Priantydning</th>
            <th @click="orderBy('total_price')">Totalpris</th>
            <th>Lenke</th>
            <th>Område</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="building in searchResult" :key="building.key">
            <td><img :src="building.image" class="table_image" /></td>
            <td>{{ building.address }}, {{ building.zip_code }}</td>
            <td>{{ building.bedrooms || "Ikke spesifisert" }}</td>
            <td>{{ building.primary_room_size }}</td>
            <td>{{ building.type || "Ikke spesifisert" }}</td>
            <td>{{ Number(building.asking_price).toLocaleString() }}</td>
            <td>{{ Number(building.total_price).toLocaleString() }}</td>
            <td>
              <a :href="building.link">Lenke</a>
            </td>
            <td>
              {{ building.area || `${building.city}, ${building.zip_code}` }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div class="row"></div>
  <div class="row">
    <div class="col-md-12">
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Bilde</th>
            <th>Adresse</th>
            <th @click="orderBy('rooms')">Soverom</th>
            <th>Size</th>
            <th @click="orderBy('type')">Type</th>
            <th @click="orderBy('asking_price')">Priantydning</th>
            <th @click="orderBy('total_price')">Totalpris</th>
            <th>Lenke</th>
            <th>Område</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="building in Buildings" :key="building.key">
            <td><img :src="building.image" class="table_image" /></td>
            <td>{{ building.address }}, {{ building.zip_code }}</td>
            <td>{{ building.bedrooms || "Ikke spesifisert" }}</td>
            <td>{{ building.primary_room_size }}</td>
            <td>{{ building.type || "Ikke spesifisert" }}</td>
            <td>{{ Number(building.asking_price).toLocaleString() }}</td>
            <td>{{ Number(building.total_price).toLocaleString() }}</td>
            <td>
              <a :href="building.link">Lenke</a>
            </td>
            <td>
              {{ building.area || `${building.city}, ${building.zip_code}` }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import { ref, onMounted } from "vue";

export default {
  setup() {
    const Buildings = ref([]);
    const ascending = ref(false);
    const searchText = ref("");
    const searchPriceFrom = ref("0");
    const searchPriceTo = ref("0");
    const searchResult = ref([]);
    const searchBedroom = ref(0);
    const bedroomCount = ref(1);
    onMounted(() => {
      fetchData();
    });

    async function fetchData() {
      const URLs = ["data_eiendomsmegler1.json", "data_dnbeiendom.json", "data_eie.json", "data_privatmegleren.json"];
      const promises = URLs.map(url => fetch("data/" + url).then(response => response.json()));
      const values = await Promise.all(promises);
      values.forEach(value => {
        let keys = Object.keys(value);
        keys = keys.filter(key => key.length > 0);
        addBuildingDataToBuildings(keys, value);
      });

      Buildings.value.sort((a, b) => (a.total_price > b.total_price ? 1 : -1));
    }

    function addBuildingDataToBuildings(realEstates, realEstateData) {
      realEstates.forEach((key) => {
        const infoObject = realEstateData[key];
        if (infoObject.bedrooms > bedroomCount.value) {
          bedroomCount.value = infoObject.bedrooms;
        }
        if (infoObject.image == null || infoObject.image.length == 0) infoObject.image = "/../images/default_image.png";
        Buildings.value.push(infoObject);
      });
    }

    function orderBy(orderBy) {
      // Buildings
      if (ascending.value) {
        Buildings.value.sort((a, b) => (a[orderBy] > b[orderBy] ? 1 : -1));
      } else {
        Buildings.value.sort((a, b) => (a[orderBy] > b[orderBy] ? -1 : 1));
      }
      ascending.value = !ascending.value;
    }

    function search() {
      searchResult.value = [];
      if (searchText.value.length <= 0) return;
      Buildings.value.forEach((building) => {
        if (
          building["address"]
            ?.toLowerCase()
            .includes(searchText.value.toLowerCase())
        ) {
          searchResult.value.push(building);
        } else if (
          building["link"]
            ?.toLowerCase()
            .includes(searchText.value.toLowerCase())
        ) {
          searchResult.value.push(building);
        }
      });
    }
    function bedroomSearch() {
      searchResult.value = [];
      if (searchBedroom.value == 0) return;
      Buildings.value.forEach((building) => {
        if (parseInt(building["bedrooms"]) == searchBedroom.value) {
          searchResult.value.push(building);
        }
      });
    }

    function priceSearch() {
      searchResult.value = [];

      const priceTo = parseInt(searchPriceTo.value);
      if (priceTo <= 0) return;
      if (parseInt(searchPriceFrom.value) > priceTo) {
        searchPriceFrom.value = priceTo;
      }
      const priceFrom = parseInt(searchPriceFrom.value);
      Buildings.value.forEach((building) => {
        const buildingPrice = parseInt(building["asking_price"]);
        if (buildingPrice > priceFrom && buildingPrice < priceTo) {
          searchResult.value.push(building);
        }
      });
    }

    function searchAll() {
      searchResult.value = [];
      const priceTo = parseInt(searchPriceTo.value);
      if (
        priceTo <= 0 &&
        searchBedroom.value == 0 &&
        searchText.value.length <= 0
      )
        return;

      if (parseInt(searchPriceFrom.value) > priceTo) {
        searchPriceFrom.value = priceTo;
      }
      const priceFrom = parseInt(searchPriceFrom.value);
      Buildings.value.forEach((building) => {
        const bedrooms = parseInt(building["bedrooms"]);
        const buildingPrice = parseInt(building["asking_price"]);
        const address = building["address"];
        const link = building["link"];

        let bedroomMatch = true;
        if (searchBedroom.value != 0 && bedrooms != searchBedroom.value) {
          bedroomMatch = false;
        }
        let priceMatch = true;
        if (priceTo > 0 && (buildingPrice < priceFrom || buildingPrice > priceTo)) {
          priceMatch = false;
        }
        let searchMatch = true;
        const searchTextSmall = searchText.value.toLowerCase();
        if (searchTextSmall.length > 0 && !address?.toLowerCase().includes(searchTextSmall) && !link?.toLowerCase().includes(searchTextSmall)) {
          searchMatch = false;
        }
        if (bedroomMatch && priceMatch && searchMatch) {
          searchResult.value.push(building);
        }
      });
    }

    function clearFilter() {
      searchText.value = "";
      searchPriceTo.value = 0;
      searchPriceFrom.value = 0;
      searchBedroom.value = 0;
      searchResult.value = [];
    }

    return {
      Buildings,
      orderBy,
      search,
      searchText,
      searchResult,
      searchPriceFrom,
      searchPriceTo,
      bedroomSearch,
      priceSearch,
      bedroomCount,
      searchBedroom,
      clearFilter,
      searchAll,
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