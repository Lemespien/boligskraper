<template>
    <td><img :src="building.image" class="table_image" /></td>
    <td>{{ building.address }}, {{ building.zip_code }}</td>
    <td>{{ building.bedrooms || "Ikke spesifisert" }}</td>
    <td>{{ building.primary_room_size }}</td>
    <td>{{ Number(building.asking_price).toLocaleString() }}</td>
    <td>
        <a :href="building.link">Lenke</a>
    </td>
    <td>
        {{ building.area || `${building.city} ${building.zip_code || ''}` }}
    </td>
</template>
<script>

export default {
    props: {
        building: {
            type: Object,
            required: true,
        } 
      },
    setup(props) {
        return props.building;
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