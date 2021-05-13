<template>
    <div class="form-group col-md-4">
        <label :for="props.name">{{props.labelText}}</label>
        <input
            class="form-control"
            type="text"
            :name="props.name"
            :id="props.name"
            :placeholder="props.labelText"         
            v-model="search"
            @change="handleUpdate"
        />
    </div>
</template>
<script>
import { ref } from "vue";

export default {
    props: {
        name: {
            type: String,
            required: true,
        },
        labelText: {
            type: String,
            required: true
        }
    },
    setup(props, context) {
        const search = ref("");

        const handleUpdate = () => {
            context.emit('search', 1);
        }
        return {
            handleUpdate,
            search,
            props
            };
    }
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