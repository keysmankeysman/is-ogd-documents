<template>
    <div>
        <data-table
            :columns="columns"
            :items="sortingItems"
            :count="count"
            :viewColumns="viewColumns"
            :selectable="selectable"
            @onSortField="setSortingValue"
            @upCount="upCount"
            filterable
            pagable
        ></data-table>
    </div>
</template>

<script>
import DataTable from '@/components/DataTable'
import dataShort from './data/dataShort.js'

export default {
    data() {
        return {
            columns: [],
            items: [],
            sortingItems: [],
            viewColumns: ['territory', 'status'],
            count: 24,
            selectable: true,
            sortField: '',
            lastSortField: ''
        }
    },
    methods: {
        sortingBy() {
            let items = [...this.items]
            if (this.sortField) {
                this.sortingItems = items.sort((a, b) => {
                    if (a[this.sortField] < b[this.sortField]){
                        return -1
                    }
                    if (a[this.sortField] > b[this.sortField]){
                        return 1
                    }
                        return 0
                }) 
            } else {
                this.sortingItems = this.items
            }
            this.lastSortField = this.sortField
        },
        sortingOut () {
            let items = [...this.items]
            this.sortingItems = items.sort((a, b) => {
                if (b[this.sortField] < a[this.sortField]){
                    return -1
                }
                if (b[this.sortField] > a[this.sortField]){
                    return 1
                }
                    return 0
            })
            this.lastSortField = ''
        },
        setSortingValue (column) {
            this.sortField = column
            if(this.lastSortField === column) {
                this.sortingOut()
            } else {
                this.sortingBy()
            }
        },
        upCount(count) {
            this.count = count
        }
    },
    created() {

        let filterColumn = [];

        dataShort.columns.forEach(col => { 
            if(this.viewColumns.includes(col.field)) {
                filterColumn.push(col)
            }
        })

        this.columns = filterColumn;

        let arr = []

        dataShort.list.map(item => {
            let obj = {}
            item.attributes.forEach(e => {
                obj[e.name] = e.value
            })
            arr.push(obj)
        })

        this.items = arr;
        this.sortingBy()    
    },
    components: {
        DataTable
    }
}
</script>