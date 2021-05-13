<template>
  <div>
    <div class="form-row align-items-center">
      <InputText ref="searchText" name="searchText" labelText="Søk på adresse eller lenke" @search="searchAll"></InputText>
      <InputNumber ref="priceFrom" name="price_from" labelText="Pris fra" @search="searchAll"></InputNumber>
      <InputNumber ref="priceTo" name="price_to" labelText="Pris til" @search="searchAll"></InputNumber>
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
      <BuildingTable tableType="table-primary" :buildings="searchResult"></BuildingTable>
    </div>
  </div>
  <div class="row"></div>
  <div class="row">
    <div class="col-md-12">
      <BuildingTable tableType="table-striped" :buildings="Buildings"></BuildingTable>
    </div>
  </div>
</template>
<script>
import { ref, onMounted } from "vue";
import InputNumber from "./InputNumber";
import InputText from "./InputText";
import BuildingTable from "./BuildingTable"


export default {
  components: { BuildingTable, InputNumber, InputText },
  setup() {
    const Buildings = ref([]);
    const ascending = ref(false);
    const searchText = ref(null);
    const priceFrom = ref(null);
    const priceTo = ref(null);
    const searchResult = ref([]);
    const searchBedroom = ref(0);
    const bedroomCount = ref(1);
    onMounted(() => {
      fetchDataLocal();
      // fetchData();
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
    
    async function fetchDataLocal() {      
      const URLs = ["data_eiendomsmegler1.json", "data_dnbeiendom.json", "data_eie.json", "data_privatmegleren.json"];
      const promises = URLs.map(url => require("../../data/" + url)); //fetch("data/" + url).then(response => response.json()));
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
      if (searchText.value.search.length <= 0) return;
      Buildings.value.forEach((building) => {
        if (
          building["address"]
            ?.toLowerCase()
            .includes(searchText.value.search.toLowerCase())
        ) {
          searchResult.value.push(building);
        } else if (
          building["link"]
            ?.toLowerCase()
            .includes(searchText.value.search.toLowerCase())
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

      const priceTo = parseInt(priceTo.value.price);
      if (priceTo <= 0) return;
      if (parseInt(priceFrom.value.price) > priceTo) {
        priceFrom.value.price = priceTo;
      }
      const priceFrom = parseInt(priceFrom.value.price);
      Buildings.value.forEach((building) => {
        const buildingPrice = parseInt(building["asking_price"]);
        if (buildingPrice > priceFrom && buildingPrice < priceTo) {
          searchResult.value.push(building);
        }
      });
    }

    function searchAll() {
      searchResult.value = [];
      const localPriceTo = parseInt(priceTo.value.price);
      if (
        localPriceTo <= 0 &&
        searchBedroom.value == 0 &&
        searchText.value.search.length <= 0
      )
        return;

      if (parseInt(priceFrom.value.price) > localPriceTo) {
        priceFrom.value.price = localPriceTo;
      }
      const localPriceFrom = parseInt(priceFrom.value.price);
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
        if (localPriceTo > 0 && (buildingPrice < localPriceFrom || buildingPrice > localPriceTo)) {
          priceMatch = false;
        }
        let searchMatch = true;
        const searchTextSmall = searchText.value.search.toLowerCase();
        if (searchTextSmall.length > 0 && !address?.toLowerCase().includes(searchTextSmall) && !link?.toLowerCase().includes(searchTextSmall)) {
          searchMatch = false;
        }
        if (bedroomMatch && priceMatch && searchMatch) {
          searchResult.value.push(building);
        }
      });
    }

    function clearFilter() {
      searchText.value.search = "";
      priceTo.value.price = 0;
      priceFrom.value.price = 0;
      searchBedroom.value = 0;
      searchResult.value = [];
    }

    return {
      Buildings,
      orderBy,
      search,
      searchText,
      searchResult,
      priceFrom,
      priceTo,
      bedroomSearch,
      priceSearch,
      bedroomCount,
      searchBedroom,
      clearFilter,
      searchAll
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