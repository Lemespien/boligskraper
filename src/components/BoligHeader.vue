<template>
    <tr>
        <th>Bilde</th>
        <th>Adresse</th>
        <th @click="orderBy('rooms')">Soverom</th>
        <th>Størrelse</th>
        <th @click="orderBy('asking_price')">Priantydning</th>
        <th>Lenke</th>
        <th>Område</th>
    </tr>
</template>
<script>

export default {

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