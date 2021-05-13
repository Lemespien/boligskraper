<template>
    <div class="form-group col-md-2">
        <label :for="props.name">{{props.labelText}}</label>
        <input
            class="form-control"
            type="text"
            :name="props.name"
            :id="props.name"
            pattern="([0-9]+.{0,1}[0-9]*,{0,1})*[0-9]"
            v-model="price"
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
        const price = ref(0);

        const handleUpdate = () => {
            context.emit('search', 1);
        }
        return {
            handleUpdate,
            price,
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