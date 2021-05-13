<template>
    <table :class="'table ' +  props.tableType">
        <thead>
          <BoligHeader></BoligHeader>
        </thead>
        <tbody>
          <tr v-for="building in buildings" :key="building.key">
            <BoligCard :building="building"></BoligCard>
          </tr>
        </tbody>
    </table>
</template>
<script>
import BoligCard from "./BoligCard.vue";
import BoligHeader from "./BoligHeader";

export default {
    components: { BoligCard, BoligHeader },
    props: {
        tableType: {
            type: String,
        },
        buildings: {
            type: Object,
            required: true
        }
    },
    setup(props) {
        return {props};
    }
};
</script>